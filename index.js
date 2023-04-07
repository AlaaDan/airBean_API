const express = require('express')
const { json } = require('express')
const app = express()
const menuRouter = require('./routers/index')
const menuDB = require('./menu.json')

app.use(express.json())
app.use('/api', require('./routers/index.js'))
app.use('/api/menu', menuRouter)
app.use(json())

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log('The server listening on port ' + port)
})
