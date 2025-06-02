import { createRequestHandler } from "@react-router/serve";

// Import the built routes
import * as build from "./build/index.js";

export default createRequestHandler({ build });