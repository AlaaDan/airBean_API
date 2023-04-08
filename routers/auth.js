const express = require('express')
const authRouter = express.Router()

const { checkBody } = require('../middleware/user.middleware')
const { signUp, login } = require('../controllers/auth.controller')

authRouter.post('/signup', checkBody, signUp)
authRouter.post('/login', checkBody, login)

module.exports = authRouter
