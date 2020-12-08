# Single Party Recordings Explorer

This demo application allows you to explore the `RecordingTrack` property.

The app will create a Twilio Conference Call for you to numbers you specify. Each participant will receive their own recording track. You can then listen to each recording as well as combine specific tracks back together.

## Setup

Download and install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)

Install the Serverless Toolkit Plugin

```bash
twilio plugins:install @twilio-labs/plugin-serverless
```

Create your `.env` file from the `.env.example` file:

```bash
npx configure-env
```

Install Node packages

```bash
npm install
```

Deploy your function

```bash
twilio serverless:deploy
```

This will create a new service for you, the output will contain a unique domain.

Visit:
`https://single-party-recordings-XXXX-dev.twil.io/index.html` where `XXXX` is your unique domain.