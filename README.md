# Optimism

Software to help run [DoES Liverpool](https://doesliverpool.com)

See the [issue list](https://github.com/DoESLiverpool/optimism/issues) for what needs to be done, and [somebody-should#670](https://github.com/DoESLiverpool/somebody-should/issues/670) for the background, and [the Optimism Wiki](https://github.com/DoESLiverpool/optimism/wiki) for meeting notes and more.

## Install

 1. Install the dependencies `npm install`
 1. Set up the database `npx knex migrate:latest` (or if there have been any changes to the database structure, this will run the migrations)


## Script commands

The following commands are defined in package.json:

```javascript
"website": "nodemon --watch website website/app.js",
"api": "nodemon --watch api api/app.js",
"both": "concurrently -n \"website,api\" \"npm run website\" \"npm run api\"",
"css": "node-sass bootstrap/optimism.scss -o website/static/css",
"css-watch": "node-sass bootstrap/optimism.scss -o website/static/css -w bootstrap/optimism.scss",
"dev-all": "concurrently -n \"website,api,sass\" \"npm run website\" \"npm run api\" \"npm run css-watch\""
```

`npm run website` starts the website (by running website/app.js)

`npm run api` starts the api (by running api/app.js)

`npm run both` concurrently starts both the website and api

`npm run css` compiles the optimism.scss on demand, to website/static/css/optimism.css

`npm run css-watch` watches optimisim.scss and compiles it if it changes

`npm run dev-all` concurrently starts the website, api and css-watch

The `nodemon` commmand is used to monitor code changes in each of the website and api projects and restart these as required.

The `concurrently` command is used to start more than one command concurrently. The output from all the commands is sent to the same terminal and is prefixed with a name to identify output.

`node-sass` is used to compile scss.

## Project structure

The `website` and `api` folders contain code for the frontend website and the backend api site. Ports are hard-coded at the moment, with website starting at port 3000 and api starting on 3001.

The `bootstrap` folder contains the site scss file (optimism.scss) and a subfolder (scss) containing scss for bootstrap 4.5.1.
