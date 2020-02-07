const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('./config/authenticate.js');

const User = require('./models/users_model.js');
const Subscribe = require('./models/subscribe_model.js');

//subscribe handle
router.post('/subscribe', (req, res) =>{
    const { email, chooseWear } = req.body;
    console.log(email, chooseWear)
    const subscribe = new Subscribe({
        email,
        preference: chooseWear
    })
    subscribe.save()
        .then(subscribe => {
            res.sendFile(__dirname + "/public/pages/subscribe_success.html");
        })
        .catch(err =>{
            console.log(err);
        });
})

//display register page
router.get('/register', (req, res) =>{
    res.sendFile(__dirname + "/public/pages/register.html");
});

//display login page
router.get('/login', (req, res) =>{
    res.sendFile(__dirname + "/public/pages/login.html");
});

//display login page after registration
router.get('/redirlogin', (req, res) =>{
    setTimeout(() => {
        res.sendFile(__dirname + "/public/pages/login.html");
    }, 3000);
});

//verify if logged in at checkout page
router.get('/verify', ensureAuthenticated, (req, res) =>{
    res.redirect('/checkout');
});

//display checkout page only if logged in
router.get('/checkout', ensureAuthenticated, (req, res) =>{
    res.sendFile(__dirname + "/public/pages/checkout.html")
});

//login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/checkout',
        failureRedirect: '/cart'
    })(req, res, next);
});

//register handle
router.post('/register',(req, res) =>{
    const { email, password, firstName, lastName, address, state, postal } = req.body;
    let errors = [];
    //check required fields
    if(!email || !password || !firstName || !lastName || !address || !state || !postal){
        errors.push('Please fill in all fields. ');
    }
    // check password
    // (between 6 to 20 characters, contains at least one numeric digit, one uppercase and one lowercase letter)
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(!password.match(passw)){
        errors.push('Please enter a password between 6 to 20 characters that contains at least 1 numeric digit, 1 uppercase and 1 lowercase letter. ');      
    }
    if(errors.length > 0){
        res.send(errors)
    } else{
        //check user exist
        User.findOne({ email: email})
            .then(user => {
                if(user){
                    errors.push('Email is already registered.');
                } else{
                    let newUser = new User({
                        email, password, firstName, lastName, address, state, postal            
                    });
                    //hash password
                    bcrypt.genSalt(10, (err, salt) =>{
                        bcrypt.hash(newUser.password, salt, (err, hash) =>{
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save();
                            console.log('user registered')
                            res.send('user_registered');
                        })
                    })
                }
            })
            .catch(err => console.log(err));      
    }
});

module.exports = router;