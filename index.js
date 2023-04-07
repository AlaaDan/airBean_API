const express = require('express')
const { json } = require('express')

const app = express()
app.use(express.json())
app.use('/api', require('./routers/index.js'))
app.use(json())

const port = 8000
app.listen(port, () => {
  console.log('The server listening on port ' + port)
})
