# --- Base image
FROM node:20-alpine

# --- Set working directory
WORKDIR /app

# --- Copy only the required files
COPY . .

# --- Install deps
RUN npm ci

# --- Build the app
RUN npm run build

# --- Expose Railway port
EXPOSE 3000

# --- Run the server with runtime env vars injected
CMD ["sh", "-c", "node --import ./instrument.server.mjs ./build/server/index.js"]
