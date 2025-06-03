import 'dotenv/config';
import * as Sentry from "@sentry/react-router";

Sentry.init({
 dsn: "https://616943f3eec66b1d5acb4783aa1baf18@o4509344740474880.ingest.de.sentry.io/4509360074391632",
 sendDefaultPii: true,
 tracesSampleRate: 1.0,
});