# Multi-stage Docker build for production
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY components.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY client/ ./client/
COPY server/ ./server/

# Build the application for production
RUN npm run build

# Production stage with Nginx
FROM nginx:1.25-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create nginx user if it doesn't exist
RUN addgroup -g 101 -S nginx 2>/dev/null || true
RUN adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx 2>/dev/null || true

# Copy built static files to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx pid directory
RUN mkdir -p /var/run/nginx && chown nginx:nginx /var/run/nginx

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chown -R nginx:nginx /var/cache/nginx
RUN chown -R nginx:nginx /var/log/nginx
RUN chown -R nginx:nginx /etc/nginx/conf.d

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx
ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]