# isThePowerOut

Text Messages When The Power In Your House Goes Out

## Getting Started

Add the following environment variables:

```
to: The number you want to text.
from: A valid Twilio phone number
TWILIO_AUTH: A valid Twilio auth key.
TWILIO_SID: A valid Twilio SID
```

Be sure to change the `url` to a local url on your network that will turn off should the power go off.

`npm i`
`npm run start`
