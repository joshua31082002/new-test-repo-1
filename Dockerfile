FROM alpine:3.22 AS build
WORKDIR /site
COPY . /site

FROM nginx:1.29-alpine AS runtime
COPY --from=build /site /usr/share/nginx/html
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf \
    && sed -i 's/listen  \[::\]:80;/listen       [::]:8080;/' /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
