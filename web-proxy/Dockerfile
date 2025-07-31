FROM nginx:1.22.0-alpine

COPY ./nginx-proxy.conf /etc/nginx/nginx.conf
HEALTHCHECK --interval=10s CMD ["sh", "-c", "wget http://localhost/nginx_status -q -O /dev/null"]