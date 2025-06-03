# Step 1: Install dependencies (dev)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Step 2: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Step 3: Production container
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only what's needed
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/instrument.server.mjs ./instrument.server.mjs

# Expose port (Railway uses this automatically)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
