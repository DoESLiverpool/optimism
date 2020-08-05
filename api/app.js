const express = require('express')
const db = require('./db')
const Resource = require('./models/resource')
const app = express()
const port = 3001

app.get('/', (req, res) => res.send('Hello Optimism!'))

app.listen(port, () => console.log(`Optimism api listening on port ${port}.`))

