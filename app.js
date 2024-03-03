const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoute')
// const cors = require("cors");
const pool = require("./db");
const cookieParser = require('cookie-parser')

const app = express();

// middleware
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');


//middleware
// app.use(cors())
app.use(express.json())
// app.use(cookieParser)
// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies')); 
app.use(authRoutes)

app.use(cookieParser());

app.get('/set-cookies', (req, res) => {

  // res.setHeader('Set-Cookie', 'newUser=true');
  
  res.cookie('newUser', false);
  res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

  res.send('you got the cookies!');

});

app.get('/read-cookies', (req, res) => {

  const cookies = req.cookies;
  console.log(cookies.newUser);

  res.json(cookies);

});

app.listen(3000, () =>{
  console.log("server has started on port 5000")
})