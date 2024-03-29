# Optimism

Software to help run [DoES Liverpool](https://doesliverpool.com)

Most of the development work takes place on the `develop` branch.

See the [issue list](https://github.com/DoESLiverpool/optimism/issues) for what needs to be done, and [somebody-should#670](https://github.com/DoESLiverpool/somebody-should/issues/670) for the background, and [the Optimism Wiki](https://github.com/DoESLiverpool/optimism/wiki) for meeting notes and more.

## Install

NOTE: You'll need to be using `npm` version 7 or above for this to work, **and** version 14 or *earlier* of NodeJS because `node-sass` does not support version 16 yet.

 1. Install the dependencies `npm install`
 1. Set up the database `npx knex migrate:latest --knexfile ./api/knexfile.js` (or if there have been any changes to the database structure, this will run the migrations)
 1. Create a `.env` file in this folder.  This will hold any configuration options you need to set.  For a basic development setup this should suffice:
    ````
    OPTIMISM_API_PORT = 3001
    OPTIMISM_WEBSITE_PORT = 3000
    OPTIMISM_API_URL = 'http://localhost:3001/api'

    OPTIMISM_ENABLE_DETAILED_ERROR_MESSAGES = 1
    ````
 1. [Optional] Populate the development database with some sample data: `npx knex seed:run --env development --knexfile ./api/knexfile.js` (**WARNING: this will delete any data in the database already**)

## Script commands

The following commands are defined in package.json:

```javascript
"scripts": {
    "test-api": "cross-env NODE_ENV=testing mocha api --recursive --exit --timeout 3500 --require mocha-suppress-logs",
    "website": "nodemon --watch website website/app.js",
    "api": "nodemon --watch api api/app.js",
    "both": "concurrently -n \"website,api\" \"npm run website\" \"npm run api\"",
    "css": "sass website/scss/optimism.scss:website/static/css/optimism.css",
    "css-watch": "sass website/scss/optimism.scss:website/static/css/optimism.css --watch",
    "dev": "concurrently -n \"website,api,sass\" \"npm run website\" \"npm run api\" \"npm run css-watch\""
}
```
`npm run test-api` runs the API tests

`npm run website` starts the website (by running website/app.js)

`npm run api` starts the api (by running api/app.js)

`npm run both` concurrently starts both the website and api

`npm run css` compiles the optimism.scss on demand, to website/static/css/optimism.css

`npm run css-watch` watches optimisim.scss and compiles it if it changes

`npm run dev` concurrently starts the website, api and css-watch


The `nodemon` commmand is used to monitor code changes in each of the website and api projects and restart these as required.

The `concurrently` command is used to start more than one command concurrently. The output from all the commands is sent to the same terminal and is prefixed with a name to identify output.

`sass` is used to compile scss.

`eslint` is installed as a dev dependency. To run it against the api project (as an example) run `npx eslint api`.

## Project structure

The `website` and `api` folders contain code for the frontend website and the backend api site. Ports are hard-coded at the moment, with website starting at port 3000 and api starting on 3001.

The `bootstrap` folder contains the site scss file (optimism.scss) and a subfolder (scss) containing scss for bootstrap 4.5.1.

## Docker version

For production we're running the `api` and `website` components as separate Docker containers, with an off-the-shelf Postgres container to provide the database.

Their interactions are orchestrated with `docker-compose`, so getting it running should just be a case of running:
  * `docker-compose build`
  * `docker-compose up`

To run any database migrations, once things are running then run: `docker-compose exec api npx knex migrate:latest --env production`

Any time things are pushed to the `master` branch, the [live site will automatically deploy the new version](https://github.com/DoESLiverpool/optimism/issues/48).

## Also see

[Testing](./documentation/testing)