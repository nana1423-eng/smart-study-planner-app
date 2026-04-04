#!/bin/sh
# Replace the placeholder RUNTIME_VITE_API_URL with the actual runtime environment variable
find /usr/share/nginx/html -type f -name "*.html" -exec sed -i "s|RUNTIME_VITE_API_URL|${VITE_API_URL}|g" {} +

# Start Nginx
exec nginx -g 'daemon off;'
