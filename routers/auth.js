const express = require('express')

const authRouter = express.Router()
authRouter.get('/', (req, res) => {
  res.json('hello')
})

module.exports = authRouter
