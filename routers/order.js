const express = require('express')
const orderRouter = express.Router()

const {
  getOrderStatus,
  addNewOrder,
} = require('../controllers/order.controller')
const { checkBodyOnOrder } = require('../middleware/order.middleware')

orderRouter.post('/', checkBodyOnOrder, addNewOrder)
orderRouter.get('/:ordernumber',  getOrderStatus)

module.exports = orderRouter
