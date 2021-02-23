//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
const saltRound = 10

app.post('/register', (req, res) => {
  const userName = req.body.username
  const password = req.body.password

  bcrypt.hash(password, saltRound, (err, hash) => {
    const newUser = new User({
      email: userName,
      password: hash,
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
})

//Login a User

app.post('/login', (req, res) => {
  const userName = req.body.username
  const password = req.body.password

  User.findOne({ email: userName }, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result === true) {
            res.render('secrets')
          }
        })
      }
    }
  })
})

// Listen to Port 3000

app.listen(3000, () => console.log('Server started successfully on port 3000'))
