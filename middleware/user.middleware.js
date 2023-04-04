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

module.exports = {
  checkBody,
}
