export default async function handler(req, res) {
    const { createRequestHandler } = await import("@react-router/serve");
    const build = await import("/build/server/index.js");

    const requestHandler = createRequestHandler({ build });
    return requestHandler(req, res);
}