function checkBody(request, response, next) {
    const cartContent = [...request.body.cart];
    for (product of cartContent) {
        if(
            cartProduct == {
                "id":number,
                "title":string,
                "desc":string,
                "price":number
            }
        ) {
            next();
        }
        else {
            response.status(400).json({ message: "Incorrect product data" })
        }
    }
}

module.exports = {
    checkBody
}