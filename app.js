const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello Optimism!'))

app.listen(port, () => console.log(`Optimism app listening on port ${port}!`))

