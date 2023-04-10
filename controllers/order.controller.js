const { v4: uuidv4 } = require('uuid')
const menuItems = require('../model/menu.model')
const Datastore = require('nedb')
const {productPreptime,deliveryDistance,formatDateYYMMDD} = require('../util/helper')
const { findUserOnDatabaseByUserId } = require('./auth.controller')

const orderHistory_database = new Datastore({
  filename: './database/orderHistory.db',
  autoload: true,
})

orderHistory_database.loadDatabase()

async function addNewOrder(request, response) {
  const { user_id, products, total } = request.body
  try {
    if (user_id !== '') {
      const user = await findUserOnDatabaseByUserId(user_id)
      if (!user)
        return response
          .status(404)
          .json({ success: false, message: 'User not found' })
    }

    const orderNumber = uuidv4()

    const productionTime = productPreptime(products[0])
    const deliveryTime = deliveryDistance(10)
    const shippingTime = productionTime + deliveryTime
    const createdAt = new Date().getTime()
    const finishedAt = createdAt + shippingTime * 60000
    orderHistory_database.insert({
      user_id,
      products,
      total,
      orderNumber,
      createdAt,
      finishedAt,
    })

    response.status(200).json({
      success: true,
      message: 'Order received',
      orderNumber,
      deliveryTime: shippingTime,
    })
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: 'Something wrong on server' })
  }
}

async function getOrderStatus(request, response) {
  //TODO: Lägg till checkBody, ta emot en array med ID från varje produkt
  try {
    const order = await findOneOrderOnDatabase(request.params.ordernumber)
    if (order) {
      const currentTime = new Date().getTime()
      const finishedAt = order.finishedAt
      const shippingTime = Math.round((finishedAt - currentTime) / 60000)

      const detail = {
        orderNumber: order.orderNumber,
        createdAt: formatDateYYMMDD(order.createdAt),
        total: order.total,
        products: order.products,
      }
      let formatedFinishedAt = formatDateYYMMDD(finishedAt)
      if (shippingTime < 1) {
        response.status(200).json({
          success: true,
          detail,
          message: 'Your order is delivered',
        })
      } else {
        response.status(200).json({
          success: true,
          detail,
          deliveryTime: `${shippingTime} minutes - ${formatedFinishedAt}`,
        })
      }
    } else {
      response.status(400).json('No matching order could be found')
    }
  } catch (error) {
    console.log(error)
    return response
      .status(500)
      .json({ success: false, message: 'Something wrong on server' })
  }
}

async function getOrderHistoryByUserId(request, response) {
  try {

    const orderHistory = await findAllOrderOnDatabase(request.params.user_id)
    let history =[]
    if(orderHistory){
      history= orderHistory.map((order) => {
        return {
          orderNumber: order.orderNumber,
          createdAt: formatDateYYMMDD(order.createdAt),
          total: order.total,
          products: order.products,
  
        }
      })
    }
     return response.status(200).json({
      success:true,
      history
     })

  } catch (error) {
    console.log(error);
    return response
    .status(500)
    .json({ success: false, message: 'Something wrong on server'})
  }
}

function findOneOrderOnDatabase(orderNumber) {
  return new Promise((resolve, reject) => {
    orderHistory_database.findOne(
      {
        orderNumber,
      },
      (err, order) => {
        if (err) {
          reject(err)
        }
        resolve(order)
      }
    )
  })
}
function findAllOrderOnDatabase(user_id) {
  return new Promise((resolve, reject) => {
    orderHistory_database.find(
      {
        user_id,
      },
      (err, order) => {
        if (err) {
          reject(err)
        }
        resolve(order)
      }
    )
  })
}
module.exports = {
  addNewOrder,
  getOrderStatus,
  getOrderHistoryByUserId
}
