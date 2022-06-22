FROM node:16-alpine as build

WORKDIR /app

COPY ./angular /app

RUN npm install

RUN npm run build


FROM nginx

COPY --from=build /app/dist/app /usr/share/nginx/html

COPY ["./nginx/nginx.conf", "/etc/nginx/nginx.conf"]

COPY ["./nginx/certs", "/etc/ssl/private"]