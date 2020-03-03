const express = require('express')
const Sequelize = require('sequelize')
const app = express()
const port = 3000

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/development.sqlite'
})

app.get('/', (req, res) => res.send('Hello Optimism!'))

app.listen(port, () => console.log(`Optimism app listening on port ${port}!`))

