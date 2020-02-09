const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/users_model.js');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) =>{
            //match user
            User.findOne({ email: email, status: true})
                .then(user =>{
                    if(!user){
                        return done(null, false, { message: 'That user does not exist.'});
                    }
                    //match password
                    bcrypt.compare(password, user.password, (err, isMatch) =>{
                        if(err) throw err;
                        if(isMatch){
                            console.log('user login success')
                            return done(null, user);
                        } else{
                            return done(null, false, { message: 'Password incorrect'})
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}