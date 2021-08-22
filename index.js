const twilio = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);
const Ping = require("ping-wrapper");

function main() {
  Ping.configure();
  const url = "192.168.1.93";
  const ping = new Ping(url);

  console.log("Pinging ", url, "\n You will only be alerted if a ping fails.");

  let numberOfTexts = 0;
  let numberOfFailures = 0;

  ping.on("fail", function (data) {
    console.log("Failure", data);
    numberOfFailures += 1;
    if (numberOfTexts < 5 && numberOfFailures >= 5) {
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
            setTimeout(() => (numberOfTexts = 0), 30000);
          }
        })
        .catch((e) => console.error(e));
    }
  });
}

main();
