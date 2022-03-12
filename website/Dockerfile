# Simple docker setup for the web server
FROM node:13

EXPOSE 3001

# This might be handy during debugging
ENV NPM_CONFIG_LOGLEVEL info

ENV NODE_ENV=production
# FIXME Get this from a better place rather than hard-coded
ENV OPTIMISM_API_URL=http://optimism_api:3001/api

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
COPY settings.js settings.js
COPY utilities.js utilities.js
COPY routes routes
COPY static static
COPY templates templates

# Build the css files from scss source
COPY scss scss
RUN npm run css

# How we want to start the server
CMD ["node", "/home/node/app/app.js"]

# Now we're at the end, set the user we want to run as
USER node
