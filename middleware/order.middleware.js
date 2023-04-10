const Joi = require('joi')
const menuItems = require('../model/menu.model')

function checkBodyOnOrder(request, response, next) {
  console.log(menuItems);
  // check if body has user_id, products and products is not empty
  if (
    !request.body.hasOwnProperty('user_id') ||
    !request.body.hasOwnProperty('products') ||
    !request.body.hasOwnProperty('total') ||
    !request.body.products.length != 0
  )
    return response.status(400).json({ success:false, message: 'Missing cart data in body' })

  // continue to the next validation
  const products = request.body.products
  for (const product of products) {
    // validate product on product list
    const { error } = itemCheck(product)
    if (error)
      return response
        .status(400)
        .json({ success:false, message: 'Incorrect product data type' })

    // check price on product if it is the same as in menu.jso
    const productOnMenu =  menuItems().find((item) => {
      return item.id === product.id && item.title === product.title
    })
    if(!productOnMenu) 
      return response.status(400).json({success:false, message: "This product is not in the menu"})
    
    if(productOnMenu.price !== product.price) 
      return response
      .status(400)
      .json({ success:false, message: 'Price on product was incorrect' })
    
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
