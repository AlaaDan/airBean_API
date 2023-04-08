const { Router } = require('express')
const router = Router()
const getMenu = require('../controllers/menu.controller')

router.get('/', getMenu)

module.exports = router
