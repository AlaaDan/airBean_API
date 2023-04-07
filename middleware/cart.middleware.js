function checkBody(request, response, next) {
    const cartContent = [...request.body.cart];
    const error = itemCheck(cartContent)
    for (product of cartContent) {
        if(error) return response.status(400).json({ message: "Incorrect product data" })
                
        else {
            next()
        }
    }
}
function itemCheck(item){
    const schema = Joi.object({
        id: Joi.number().required(),
        title: Joi.string().required(),
        desc: Joi.string().required(),
        price: Joi.number().required()

    })
    return schema.validate(item)
}
module.exports = {
    checkBody
}
