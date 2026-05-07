FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_SUPABASE_URL=http://localhost:8480
ARG VITE_SUPABASE_ANON_KEY=your_anon_key_here

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

RUN apk upgrade --no-cache

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM caddy:2-alpine

RUN apk upgrade --no-cache

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/caddy

EXPOSE 80

