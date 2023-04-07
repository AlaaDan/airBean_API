const Joi = require('joi')

function checkBody(request, response, next) {
    //const cartContent = [...request.body.cart];
    const {error} = itemCheck(request.body)
    if(error) return response.status(400).send(error.details[0].message)
    else{
        next()

    }

    // for (product of cartContent) {
    //     if(error) return response.status(400).json({ message: "Incorrect product data" })
                
    //     else {
    //         next()
    //     }
    // }
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
