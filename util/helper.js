
function formatDateYYMMDD(time) {
    const date = new Date(time)
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month < 10) month = '0' + month.toString()
    let day = date.getDate()
    if (day < 10) day = '0' + day.toString()
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if(minutes < 10) minutes = '0' + minutes.toString();
    if(hours < 10) hours = '0' + hours.toString();
    return `${year}-${month}-${day}-${hours}:${minutes}`
  }
  
  function productPreptime(product) {
    let productionTime = 0
    for (product of menuItems()) {
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
  

module.exports = {
    deliveryDistance,
    productPreptime,
    formatDateYYMMDD
  }