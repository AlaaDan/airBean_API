const { Router } = require('express');
const router = Router()
const getMenu = require('../controllers/menuControler')

router.get('/', getMenu)

module.exports = router