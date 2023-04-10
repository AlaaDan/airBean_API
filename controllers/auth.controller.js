const bcrypt = require('bcrypt')
const Datastore = require('nedb')
const { v4: uuidv4 } = require('uuid')
const user_database = new Datastore({
  filename: './database/users.db',
  timestampData: true,
  autoload: true,
  corruptAlertThreshold: 1,
})

user_database.loadDatabase()

const signUp = async (req, res) => {
  try {
    const user = await findUserOnDatabaseByUserName(req.body.username)
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
      user_id: uuidv4(),
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
}

const login = async (req, res) => {
  console.log(res.body)
  try {
    const user = await findUserOnDatabaseByUserName(req.body.username)
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
      user_id: user.user_id,
    })
  } catch (error) {
    console.log(error)
  }
}
function findUserOnDatabaseByUserName(username) {
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

function findUserOnDatabaseByUserId(user_id) {
  return new Promise((resolve, reject) => {
    user_database.findOne(
      {
        user_id,
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
module.exports = { signUp, login, findUserOnDatabaseByUserName,findUserOnDatabaseByUserId }
