# Simple docker setup for the API server

FROM node:16

EXPOSE 3001

# Arguments to allow us to run production or test from the same Dockerfile
ARG NODE_ENVIRONMENT=production
ARG TEST_FOLDER=no-test

# This might be handy during debugging
ENV NPM_CONFIG_LOGLEVEL info

ENV NODE_ENV=$NODE_ENVIRONMENT

# Install global npm modules to the non-root user (called `node` in the default Node container)
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# FIXME we might want to run under Tini, but for now we should run docker with --init instead
# FIXME see https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals for the explanation around this

WORKDIR /home/node/app

# Install our dependencies
COPY package*.json ./
RUN npm install

# Copy the API code into the container
COPY app.js app.js
COPY model model
COPY model.js model.js
COPY db.js db.js
COPY routes routes
COPY migrations migrations
COPY seeds seeds
COPY knexfile.js knexfile.js
COPY $TEST_FOLDER test

# How we want to start the server
# Default to just starting the server, for the test build we'll override this
# see https://github.com/DoESLiverpool/optimism/issues/32 for details
CMD ["node", "/home/node/app/app.js"]

# Now we're at the end, set the user we want to run as
USER node
