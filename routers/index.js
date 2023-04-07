const express = require('express')
const authRouter = require('./auth')
const app = express()
const router = express.Router
const menu =require('../controllers/menuControler')
const menuItems = require('../model/menu.model')
const menuDB = require('../menu.json')


app.use('/auth', authRouter)
router.get('/', (req, res)=>{
    res.send(menuDB)
})

module.exports = app
module.exports = router