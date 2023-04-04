const express = require('express')
const Datastore = require('nedb')
const { v4: uuidv4 } = require('uuid')
const { checkBody } = require('../middleware/user.middleware')
const bcrypt = require('bcrypt')
const user_database = new Datastore({
  filename: './database/users.db',
  timestampData: true,
  autoload: true,
  corruptAlertThreshold: 1,
})
user_database.loadDatabase()
const authRouter = express.Router()
authRouter.post('/signup', checkBody, async (req, res) => {
  try {
    const user = await findUserOnDatabase(req.body.username)
    if (user) {
      return res.status(200).json({
        success: false,
        message: 'Username is already exists',
      })
    }

    const saltRounds = 10
    const hash = await bcrypt.hashSync(req.body.password, saltRounds)
    const newUser = {
      username: req.body.username,
      hash,
      _id: uuidv4(),
    }
    user_database.insert(newUser, (err, newDoc) => {
      if (newDoc) {
        return res.status(200).json({
          success: true,
        })
      }
    })
  } catch (error) {
    return res.status(500).json(error)
  }
})

authRouter.post('/login', checkBody, async (req, res) => {
  try {
    const user = await findUserOnDatabase(req.body.username)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const isCorrectPassword = await bcrypt.compareSync(
      req.body.password,
      user.hash
    )
    if (!isCorrectPassword) {
      return res.status(200).json({
        success: false,
        message: 'Incorrect password',
      })
    }
    return res.status(200).json({
      success: true,
      userId: user._id,
    })
  } catch (error) {
    console.log(error)
  }
})

function findUserOnDatabase(username) {
  return new Promise((resolve, reject) => {
    user_database.findOne(
      {
        username,
      },
      (err, user) => {
        if (err) {
          reject(err)
        }
        resolve(user)
      }
    )
  })
}
module.exports = authRouter
