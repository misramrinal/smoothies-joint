// const express = require('express');
const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser')

// const router = express.Router()

const cookieParser = require("cookie-parser")
// router.use(cookieParser())

// const app = express();
// app.use(cookieParser())
const secret = 'mrinal'

const requireAuth = (req, res, next) => {
    console.log("Hello")
    let token = req.get('cookie')
    // console.log(req.get('cookie').slice(4))
    if (token){
        token = token.slice(4)
        jwt.verify(token, secret, (err, decodedToken) =>{
            if(err){
                console.log(err.message)
                res.locals.user = null
                res.redirect('/login')
            }
            else{
                console.log(decodedToken)
                res.locals.user = 'yo'
                next()
            }
        })
    }
    else{
        res.locals.user = 'yo'
        res.redirect('/login')
    }
}

const userLogged = (req, res, next) => {
    console.log("Hello")
    let token = req.get('cookie')
    // console.log(req.get('cookie').slice(4))
    if (token){
        token = token.slice(4)
        jwt.verify(token, secret, (err, decodedToken) =>{
            if(err){
                console.log(err.message)
                res.locals.user = null
                // res.redirect('/login')
            }
            else{
                console.log(decodedToken)
                res.locals.user = 'yo'
                next()
            }
        })
    }
    else{
        res.locals.user = null
        next()
        // res.redirect('/login')
    }
}

module.exports = {requireAuth, userLogged};