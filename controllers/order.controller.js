const { v4: uuidv4 } = require('uuid')
const menu = require('../menu.json')
const Datastore = require('nedb')
const { findUserOnDatabase } = require('./auth.controller')

const orderHistory_database = new Datastore({
  filename: './database/orderHistory.db',
  autoload: true,
})

orderHistory_database.loadDatabase()

//Skicka in en array med cart innehållet och en giltig login token

/**  body ska ser ut såhär:
 * 
    user_id:'' eller 'user id',
    products:[
        {
        "id":1,
        "title":"Bryggkaffe",
        "desc":"Bryggd på månadens bönor.",
        "price":39
        "quanlity": 1
      },
      {
        "id":2,
        "title":"Caffè Doppio",
        "desc":"Bryggd på månadens bönor.",
        "price":49,
        "quanlity": 2

      },
    ],
    total: 137
    

    
  */
async function addNewOrder(request, response) {
  const { user_id, products, total } = request.body
  try {
    if (user_id !== '') {
      const user = await findUserOnDatabase(user_id)
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
    const order = await findOrderOnDatabase(request.params.ordernumber)
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
          deliveryTime: shippingTime,
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

function formatDateYYMMDD(time) {
  const date = new Date(time)
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) month = '0' + month.toString()
  let day = date.getDate()
  if (day < 10) day = '0' + day.toString()
  return `${year}-${month}-${day}`
}

function productPreptime(product) {
  let productionTime = 0
  for (product of menu.menu) {
    switch (product.id) {
      case 1:
        productionTime < 3 ? (productionTime = 3) : ''
        break
      case 2:
        productionTime < 4 ? (productionTime = 4) : ''
        break
      case 3:
        productionTime < 5 ? (productionTime = 5) : ''
        break
      case 4:
        productionTime < 2 ? (productionTime = 2) : ''
        break
      case 5:
        productionTime < 2 ? (productionTime = 2) : ''
        break
      case 6:
        productionTime < 4 ? (productionTime = 4) : ''
        break
      default:
        return 'Product not on menu'
    }
  }
  return productionTime
}

function deliveryDistance(distance) {
  const randomDistance = Math.floor(Math.random() * distance)
  return randomDistance
}

function findOrderOnDatabase(orderNumber) {
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
module.exports = {
  addNewOrder,
  getOrderStatus,
}
