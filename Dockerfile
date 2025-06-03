# Install dev dependencies for building
FROM node:20-alpine AS dev-deps
WORKDIR /app
COPY . .
RUN npm ci

# Production dependencies only
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Build the app using dev deps
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=dev-deps /app .
RUN npm run build

# Final stage: production runner
FROM node:20-alpine
WORKDIR /app

# Production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Built server and instrument file
COPY --from=builder /app/build ./build
COPY --from=builder /app/instrument.server.mjs ./instrument.server.mjs

# Copy and rename .env.local → .env


# Basic project files
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]