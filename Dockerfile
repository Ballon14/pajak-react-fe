# Multi-stage build untuk frontend yang ringan
# Stage 1: Build aplikasi React
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies dengan optimasi
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build aplikasi dengan optimasi
RUN npm run build

# Stage 2: Production dengan Nginx Alpine yang ringan
FROM nginx:alpine AS production

# Install dumb-init untuk proper signal handling
RUN apk add --no-cache dumb-init

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files dari builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 -G nginx

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Use dumb-init untuk proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]