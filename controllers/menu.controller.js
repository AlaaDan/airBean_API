const menuItems = require('../model/menu.model')

function getMenu(req,res){
    const menu = menuItems();
    res.json({success: true, menu:menu})
}

module.exports = getMenu    