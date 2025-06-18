#FROM openjdk:17-alpine

# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV=production

WORKDIR /app

RUN mkdir -p /app/log && \
    mkdir -p /app/data

#
# Install typescript into the container
#
#RUN npm install typescript -g

#
# Copy the source files into the image.
#
COPY package.json .

#
# Install dependencies
#
RUN npm install

#
# Copy App and build it
#
COPY . .
RUN npm run build

#
# Finally, remove dev dependencies
#
RUN npm prune --production

RUN chown -R ${USERNAME}:${GROUPNAME} /app && chmod -R 755 /app

#
# Run the application as NON-ROOT user
#
USER ${USERNAME}

#
# Expose the port that the application listens on.
#
EXPOSE 8081

#
# Run the application.
#
CMD ["npm", "start"]