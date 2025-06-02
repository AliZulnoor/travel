import * as Sentry from "@sentry/react-router";
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
 dsn: "https://616943f3eec66b1d5acb4783aa1baf18@o4509344740474880.ingest.de.sentry.io/4509360074391632",
 
 // Adds request headers and IP for users, for more info visit:
 // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
 sendDefaultPii: true,
 
 integrations: [nodeProfilingIntegration()],
 tracesSampleRate: 1.0, // Capture 100% of the transactions
 profilesSampleRate: 1.0, // profile every transaction
});
