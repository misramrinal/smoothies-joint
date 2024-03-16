const express = require('express');
const authRoutes = require('./routes/authRoute')
// const cors = require("cors");
const keys = require("./db");
const { Pool } = require('pg');
const pool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
  ssl:
    process.env.NODE_ENV !== 'production'
      ? false
      : { rejectUnauthorized: false },
});
pool.on('connect', (client) => {
  client
    .query('CREATE TABLE IF NOT EXISTS nodeauth (id SERIAL PRIMARY KEY, email VARCHAR(255), username VARCHAR(255), password VARCHAR(400))')
    .catch((err) => console.error(err));
});
const cookieParser = require('cookie-parser')
const {requireAuth, userLogged} = require('./routes/authMiddleware')

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
app.get('*', userLogged)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies')); 
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