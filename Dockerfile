
ARG NODE_VERSION=22.16.0

FROM node:${NODE_VERSION}-alpine

ARG UID
ARG GID
ARG USERNAME
ARG GROUPNAME
RUN addgroup --gid ${GID} ${GROUPNAME} && adduser -D -u "${UID}" -G "${GROUPNAME}" "${USERNAME}"

WORKDIR /app

RUN mkdir -p /app/log && \
    mkdir -p /app/data

#
# Install typescript into the container
#
RUN npm install typescript -g

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
#RUN npm prune --production

RUN chown -R ${USERNAME}:${GROUPNAME} /app && chmod -R 755 /app

# Use production node environment by default.
ENV NODE_ENV=production

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