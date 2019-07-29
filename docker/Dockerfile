FROM nginx:1.15-alpine

# Set healthcheck route
RUN apk --no-cache add curl
HEALTHCHECK CMD curl -f http://localhost/healthcheck || exit 1

# Copy nginx conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/config.json.template /tmp/config.json.template

# Copy application bundle
RUN mkdir -p /var/www/html
COPY build /var/www/html/

# Runtime
EXPOSE 80
CMD envsubst < /tmp/config.json.template > /var/www/html/config.json && nginx -g "daemon off;"
