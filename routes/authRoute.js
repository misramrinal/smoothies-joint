const { Router } = require('express')
const pool = require("../db");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = Router()
const auth = require('./authMiddleware')

const secret = 'mrinal'
const maxAge = 60*60 //(60 mins)

router.get('/signup', (req,res) => {
    res.render('signup')
})

const createToken = (id) =>{
    return jwt.sign({ id }, secret, {
        expiresIn: maxAge
    })
}


const authorise = async(req, res, next) =>{
    const salt = await bcrypt.genSalt()
    let { password } = req.body;
    console.log('password input is : ' + password)
    password = await bcrypt.hash(password, salt);
    req.body.password = password
    next();
}
router.post('/signup', authorise, async(req,res) => {
    // const { name, password} = req.body
    // console.log(name, password)
    try{
        const { email, username, password } = req.body;
        const result = await pool.query(
            "INSERT INTO nodeauth (email, username, password) VALUES($1, $2, $3)  RETURNING *",
         [email, username, password]
         );
        //  const newTodo = result.rows[0];
         const id = await pool.query(
            "SELECT id FROM nodeauth WHERE email = $1",
            [email]
            );
            // res.json(id);
             console.log(id.rows[0].id)
             const token = createToken(id.rows[0].id)
             res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000})//cookie timer are in milliseconds while jwt token time are in seconds
             res.json(id.rows[0].id);

        //  res.end("Completed")
    }
    catch(err) {
        console.error(err.message);
    }
    // res.end("Completed")
})

router.get('/logout', (req,res) => {
    res.cookie('jwt', '', { maxAge: 1})
    res.redirect('/')
})

router.get('/login', (req,res) => {
    res.render('login')
})

router.post('/login', async(req,res) => {
    // const { name, password} = req.body
    // console.log(name, password)
    // res.end("completed")
    try{
        const { email, password } = req.body;
        const result = await pool.query(
            "SELECT password FROM nodeauth WHERE email = $1",
            [email]
         );
         if(result.rows.lenght != 0) {
            console.log(password, result.rows[0].password)
           const auth = await bcrypt.compare(password, result.rows[0].password);
           console.log(auth)
           if(auth == true)
           {
            const id = await pool.query(
                "SELECT id FROM nodeauth WHERE email = $1",
                [email]
                );
                console.log(id.rows[0].id)
                const token = createToken(id.rows[0].id)
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000})//cookie timer are in milliseconds while jwt token time are in seconds
                res.json(id.rows[0].id);
                // console.log(id.rows[0].id)
                // res.json(id.rows[0].id);
           }
           else throw Error('Incorrect Password')

         }
        //  const newTodo = result.rows[0];
        //  if(result.rows.length != 0) res.json(newTodo);
        //  else res.send("No matches found")
        //  res.end("Completed")
    }
    catch(err) {
        console.error(err.message);
    }
    
})

module.exports = router;