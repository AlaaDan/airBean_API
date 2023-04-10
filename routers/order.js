const express = require('express')
const orderRouter = express.Router()

const {
  getOrderStatus,
  addNewOrder,
  getOrderHistoryByUserId
} = require('../controllers/order.controller')
const { checkBodyOnOrder } = require('../middleware/order.middleware')
const { checkPermission } = require('../middleware/user.middleware')

orderRouter.post('/', checkBodyOnOrder, addNewOrder)
orderRouter.get('/status/:ordernumber',  getOrderStatus)
orderRouter.get('/history/:user_id',  checkPermission, getOrderHistoryByUserId)

module.exports = orderRouter
