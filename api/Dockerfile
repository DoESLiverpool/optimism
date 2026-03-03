# Simple docker setup for the API server

FROM node:20

EXPOSE 3001

# Arguments to allow us to run production or test from the same Dockerfile
ARG NODE_ENVIRONMENT=production
ARG TEST_FOLDER=no-test

# This might be handy during debugging
ENV NPM_CONFIG_LOGLEVEL=info

ENV NODE_ENV=$NODE_ENVIRONMENT

# Set up environment from the args passed in by docker compose
ARG OPTIMISM_API_URL=http://optimism_api:3001/api
ENV OPTIMISM_API_URL=${OPTIMISM_API_URL}
ARG OPTIMISM_WEBSITE_BASE_URL=http://localhost:3000
ENV OPTIMISM_WEBSITE_BASE_URL=${OPTIMISM_WEBSITE_BASE_URL}
ARG OPTIMISM_EMAIL_ORG_FROM_ADDR=bookings@example.com
ENV OPTIMISM_EMAIL_ORG_FROM_ADDR=${OPTIMISM_EMAIL_ORG_FROM_ADDR}
ARG OPTIMISM_EMAIL_ORG_NOTIFY_ADDR=organisers@example.com
ENV OPTIMISM_EMAIL_ORG_NOTIFY_ADDR=${OPTIMISM_EMAIL_ORG_NOTIFY_ADDR}
ARG OPTIMISM_SMTP_HOST=smtp.example.com
ENV OPTIMISM_SMTP_HOST=${OPTIMISM_SMTP_HOST}
ARG OPTIMISM_SMTP_PORT=587
ENV OPTIMISM_SMTP_PORT=${OPTIMISM_SMTP_PORT}
ARG OPTIMISM_SMTP_SECURE=false
ENV OPTIMISM_SMTP_SECURE=${OPTIMISM_SMTP_SECURE}

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
COPY services services
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
