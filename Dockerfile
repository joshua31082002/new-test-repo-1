FROM nginx:1.27-alpine

COPY index.html /usr/share/nginx/html/index.html

RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
    listen 8080;
    server_name _;

    location = /health {
        default_type text/plain;
        return 200 'ok\n';
    }

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
EOF

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
