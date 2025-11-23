# Stage 1: Build the Angular application
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/youtube-ng/browser /usr/share/nginx/html

# Rename index.csr.html to index.html if it exists (Angular 17+ SSR build)
RUN if [ -f /usr/share/nginx/html/index.csr.html ]; then \
    mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; \
    fi

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
