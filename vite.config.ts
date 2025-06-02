import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from "@sentry/react-router";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "js-mastery-yx",
  project: "travel-agency",
  authToken: process.env.SENTRY_AUTH_TOKEN // ✅ secure way
};

export default defineConfig(config => {
  return {
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
      reactRouter(),
      sentryReactRouter(sentryConfig, config)
    ],
    build: {
      outDir: "build/client"
    },
    ssr: {
      noExternal: [/@syncfusion/]
    }
  };
});
