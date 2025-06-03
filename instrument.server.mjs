import 'dotenv/config';
import * as Sentry from "@sentry/react-router";

Sentry.init({
  dsn: "your_dsn_here",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0
});
