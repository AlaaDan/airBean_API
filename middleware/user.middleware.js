const { findUserOnDatabaseByUserId} = require('../controllers/auth.controller')
const checkBody = (req, res, next) => {
  if (req.body) {
    if (req.body.username && req.body.password) {
      if (
        typeof req.body.username !== 'string' ||
        typeof req.body.password !== 'string'
      ) {
        res
          .status(400)
          .json({ message: 'Username and password must be string' })
      } else {
        next()
      }
    } else {
      res.status(400).json({ message: 'Missing user data in body' })
    }
  } else {
    res.status(400).json({ message: 'Missing user data in body' })
  }
}

const checkPermission = async(req, res, next) => {
  if (req.params.user_id) {
    const user = await findUserOnDatabaseByUserId(req.params.user_id)
    if(!user) return res.status(404).json({ success:false, message: 'User not found' })
    next()
  } else {
    res.status(400).json({ message: 'Missing user id on params' })
  }
}

module.exports = {
  checkBody,
  checkPermission
}
