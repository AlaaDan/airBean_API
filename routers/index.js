const express = require('express')
const authRouter = require('./auth')
const orderRouter = require('./transaction');

const app = express()

app.use('/auth', authRouter)

app.use('/orderstatus', orderRouter)

module.exports = app
