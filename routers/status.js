const express = require('express');
const { v4: uuidv4 } = require('uuid')
const menu = require('../menu.json');
const Datastore = require('nedb');
const orderHistory_database =  new Datastore({
    filename: './database/orderHistory.db',
    timestampData: true,
    autoload: true
  })
orderHistory_database.loadDatabase();
const statusRouter = express.Router()


statusRouter.get("/:ordernumber", async(request, response) => { //TODO: Lägg till checkBody, ta emot en array med ID från varje produkt

    // const loginToken = request.body.loginToken;
    const orderNumber = request.params.ordernumber;

    const order = await findOrderOnDatabase(orderNumber)
    if(order) {
        console.log(order)
        const currentTime = new Date().getTime();

        const finishedAt = order.finishedAt;
        const restTime  = Math.round((finishedAt - currentTime) / 60000 )
        if(restTime<=0){
        response.status(200).json({success:true, orderNumber, messae:"Your order is ready for pickup"});

        }else{
            response.status(200).json({success:true, orderNumber, deliveryTime :restTime });

        }

    } else {
        response.status(400).json('No matching order could be found');
    }

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

module.exports = statusRouter