const express = require('express');

const Datastore = require('nedb');
const orderHistory_database = new Datastore({
    filename: './../database/orderHistory.db',
    timestampData: true,
    autoload: true
  })
orderHistory_database.loadDatabase();

const checkBody = require('./../middleware/cart.middleware');

const orderRouter = express.Router();

function productPreptime(products) {
    let productionTime = 0;
    for(product of products) {
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
    const randomDistance = Math.ceil(Math.Random()) * 20;
    return randomDistance;
}

function randomOrdernumber() {
    let orderNumber;
    for (i = 0; i >= 12; i++) {
        let number = Math.floor(Math.random() * 10);
        orderNumber += number.toString();
    }
    return orderNumber;
}

orderRouter.post("/", checkBody, (request, response) => { //Skicka in en array med cart innehållet och en giltig login token

    const orderNumber = randomOrdernumber();
    const cartContent = request.body.cart;

    orderHistory_database.insert({ user:request.body.token, cart:cartContent, orderNumber:orderNumber })

    const productionTime = productPreptime(cartContent);
    const deliveryTime = deliveryDistance(); 
    const totalTime = productionTime + deliveryTime;

    response.json(
        {
            success: true,
            message: "Order received",
            orderNumber: orderNumber,
            deliveryTime: totalTime
        }
    )
})

orderRouter.get("/:ordernumber", (request, response) => { //TODO: Lägg till checkBody, ta emot en array med ID från varje produkt

    const loginToken = request.body.loginToken;
    const orderNumber = request.body.orderNumber;

    if(orderHistory_database.findOne({ user:loginToken, orderNumber:orderNumber })) {

    } else {
        response.status(400).json('No matching order could be found');
    }

    response.json(totalTime);
})

module.exports = orderRouter