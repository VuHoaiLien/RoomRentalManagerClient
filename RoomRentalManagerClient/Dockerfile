# Stage 1: Build the application
FROM node:22.6.0-alpine AS build
WORKDIR /app

#Copy package files và cài dependencies
COPY package*.json ./
RUN npm install -g @angular/cli@19.0.4
RUN npm install

#Copy toàn bộ project vào container
COPY . .

#Build ứng dụng Angular
RUN ng build --configuration production

# Stage 2: Serve the application bằng Nginx
FROM nginx:alpine
COPY --from=build /app/dist/room-rental-manager-client/browser /usr/share/nginx/html

#Copy file cấu hình Nginx tùy chỉnh (nếu có)
#Copy nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]