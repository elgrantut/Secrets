//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()

//Conennect to DB
const uri = process.env.URI

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
})

//Add encryption
const secret = process.env.SECRET
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] })
const User = new mongoose.model('User', userSchema)

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

// Routes

app.get('/', (req, res) => res.render('home'))
app.get('/login', (req, res) => res.render('login'))
app.get('/register', (req, res) => res.render('register'))

//Posts
// Register a user

app.post('/register', (req, res) => {
  const userName = req.body.username
  const password = req.body.password
  const newUser = new User({
    email: userName,
    password: password,
  })
  newUser.save((err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Successfully created new user')
      res.render('secrets')
    }
  })
})

//Login a User

app.post('/login', (req, res) => {
  const userName = req.body.username
  const password = req.body.password
  User.findOne({ email: userName }, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      if (user.password === password) {
        res.render('secrets')
      }
    }
  })
})

// Listen to Port 3000

app.listen(3000, () => console.log('Server started successfully on port 3000'))
