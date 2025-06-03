import 'dotenv/config';
import * as Sentry from "@sentry/react-router";

// ⛔ Disabled profiling hook to avoid import conflicts
// import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: "https://616943f3eec66b1d5acb4783aa1baf18@o4509344740474880.ingest.de.sentry.io/4509360074391632",

  sendDefaultPii: true,

  // 🔕 Remove this to avoid 'import-in-the-middle' conflicts
  // integrations: [nodeProfilingIntegration()],
  
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
