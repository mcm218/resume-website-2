# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.16.0

# Base image
FROM node:${NODE_VERSION} as build
WORKDIR /app
COPY package.json ./

# Install all dependencies
#RUN npm install '@nx/nx-linux-x64-gnu'
RUN npm install

COPY . .

# Build stage for Angular app
# Change directory to 'src', build it, and then change back to '/app'
RUN npm run build

# Build stage for Express app
# Change directory to 'api', build it, and then change back to '/app'
RUN npm run build:api

# Final stage for app image
# FROM node:${NODE_VERSION}-slim as production
LABEL fly_launch_runtime="Node.js"
ENV NODE_ENV=production

# Expose port and start the server
EXPOSE 3000
CMD ["node", "./api/dist/index.js"]
