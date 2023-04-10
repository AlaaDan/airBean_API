const Joi = require('joi')
const menuFile = require('../menu.json')
function checkBodyOnOrder(request, response, next) {
  // check if body has user_id, products and products is not empty
  if (
    !request.body.hasOwnProperty('user_id') ||
    !request.body.hasOwnProperty('products') ||
    !request.body.hasOwnProperty('total') ||
    !request.body.products.length != 0
  )
    return response.status(400).json({ message: 'Missing cart data in body' })

  // continue to the next validation
  const products = request.body.products
  for (const product of products) {
    // validate product on product list
    const { error } = itemCheck(product)
    if (error)
      return response
        .status(400)
        .json({ message: 'Incorrect product data type' })

    // check price on product if it is the same as in menu.jso
    menuFile.menu.forEach((item) => {
      if (item.id == product.id && item.title == product.title) {
        if (item.price !== product.price) {
          return response
            .status(400)
            .json({ message: 'Price on product was incorrect' })
        }
      }
    })
  }

  next()
}

function itemCheck(item) {
  const schema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
  })
  return schema.validate(item)
}
module.exports = {
  checkBodyOnOrder,
}
