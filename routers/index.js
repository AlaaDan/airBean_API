const express = require('express')
const authRouter = require('./auth')
const orderRouter = require('./order')
const menuRouter = require('./menu')
const app = express()

app.use('/auth', authRouter)
app.use('/order', orderRouter)
app.use('/menu', menuRouter)

module.exports = app
