FROM node:18-alpine AS builder
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci --silent

# copy source and build
COPY . .
RUN npm run build

# production image
FROM nginx:alpine
# remove default config and add one that listens on 8080 (Cloud Run expects 8080)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy built static site
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]