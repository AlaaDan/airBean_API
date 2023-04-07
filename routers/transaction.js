const express = require('express');
const { v4: uuidv4 } = require('uuid')
const menu = require('../menu.json');
const Datastore = require('nedb');
const orderHistory_database = new Datastore({
    filename: './database/orderHistory.db',
    timestampData: true,
    autoload: true
  })
orderHistory_database.loadDatabase();

const {checkBody} = require('./../middleware/cart.middleware');

const orderRouter = express.Router();

function productPreptime(product) {
    let productionTime = 0;
    for(product of menu.menu) {
        switch(product.id) {
            case 1:
                productionTime < 3 ? productionTime = 3 : "";
                break;
            case 2:
                productionTime < 4 ? productionTime = 4 : "";
                break;
            case 3:
                productionTime < 5 ? productionTime = 5 : "";
                break;
            case 4:
                productionTime < 2 ? productionTime = 2 : "";
                break;
            case 5:
                productionTime < 2 ? productionTime = 2 : "";
                break;
            case 6:
                productionTime < 4 ? productionTime = 4 : "";
                break;
            default:
                return "Product not on menu";
        }
    }
    return productionTime;
}

function deliveryDistance(distance) {
    const randomDistance = Math.floor(Math.random() * distance) ;
    return randomDistance;
}


orderRouter.post("/", checkBody, (request, response) => { //Skicka in en array med cart innehållet och en giltig login token

    const orderNumber = uuidv4();
    const cartContent = request.body;


    const productionTime = productPreptime(cartContent);
    const deliveryTime = deliveryDistance(10); 
    const shippingTime = productionTime + deliveryTime;
    const createdAt = new Date().getTime()
    let finishedAt = createdAt + ( shippingTime * 60000 )
    orderHistory_database.insert({ user:request.body.token, cart:cartContent, orderNumber:orderNumber , 
        createdAt, finishedAt})

    response.status(200).json(
        {
            success: true,
            message: "Order received",
            orderNumber: orderNumber,
            deliveryTime: shippingTime
        }
    )
})


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

module.exports = orderRouter