const twilio = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);
const Ping = require("ping-wrapper");

function main() {
  Ping.configure();
  const url = "100.1.163.14";
  const ping = new Ping(url);

  console.log("Pinging ", url, "\n You will only be alerted if a ping fails.");
  console.log(
    "Sending test message. If you do not receive shortly, check your Twilio credentials."
  );

  twilio.messages
    .create({
      body: `ALERT: This is a test alert from Power Alerter confirming that you are receiving alerts.`,
      to: process.env.to, // Text this number
      from: process.env.from, // From a valid Twilio number
    })
    .then(() => console.log("Test message sent."))
    .catch((e) => console.error(e));

  let numberOfTexts = 0;
  let numberOfFailures = 0;

  ping.on("success", function () {
    console.log("Successfully pinged at ", new Date().toLocaleString());
  });

  ping.on("fail", function (data) {
    console.log("Failure", data);
    numberOfFailures += 1;
    const failureRemoval = setTimeout(() => (numberOfFailures -= 1), 30000);
    if (numberOfTexts < 5 && numberOfFailures >= 5) {
      clearTimeout(failureRemoval);
      console.log("Alerting ", process.env.to);
      twilio.messages
        .create({
          body: `ALERT: Your power has gone out.`,
          to: process.env.to, // Text this number
          from: process.env.from, // From a valid Twilio number
        })
        .then(() => {
          numberOfTexts += 1;

          if (numberOfTexts === 5) {
            console.log("Max limit reached - will alert again in 30 seconds");
            setTimeout(() => {
              numberOfTexts = 0;
              numberOfFailures = 0;
            }, 30000);
          }
        })
        .catch((e) => console.error(e));
    }
  });
}

main();
