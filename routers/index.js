const express = require('express')
const authRouter = require('./auth')
const orderRouter = require('./transaction');
const menuRouter = require('./menu_cart')
const statusRouter = require('./status')
const app = express()

app.use('/auth', authRouter)
app.use('/order', orderRouter)
app.use('/status', statusRouter)
app.use('/menu', menuRouter)

module.exports = app
