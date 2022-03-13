# Stage 1
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
FROM node:14-alpine AS builder
RUN apk add --no-cache libc6-compat

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY tsconfig.json ./

COPY . .
# Install app dependencies
RUN npm install
RUN npm run build


# Stage 2
FROM node:14-alpine

COPY package*.json ./
RUN npm install --only=production

# copy all file form /app/build to path: ./
COPY --from=builder /app/build ./ 

EXPOSE 8084
CMD node server.js

# sudo docker build -t hd-server:v1 . 
# docker run --publish hd-server:v1
# RUN npm install pm2 -g
# EXPOSE 80
# CMD ["pm2-runtime","app.js"]