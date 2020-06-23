'use strict'

const passport = require('passport');
const config = require('../config');
const h = require('../helpers');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = () =>{

    passport.serializeUser((user, done) => {
        console.log("Serialize");
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        console.log("Deserialize");
        h.findById(id)
        .then( user => {
            console.log("Finded User: ", user);
            done(null, user)
        })
        .catch( error => console.error(error));
    });

    let authProcessor = (accessToken, refreshToken, profile, done) => {
        console.log("authProcessor: ", profile);
        h.findOne(profile.id)
            .then( result => {
                console.log("Finded User by id: ", result);

                if(result) done(null, result);
                else {
                    h.createUser(profile)
                    .then(newUser => {
                        console.log("User created");
                        done(null, newUser)
                    })
                    .catch(error => console.log(error)); 
                }
            })
            .catch(error => console.log(error));
    }

    passport.use(new FacebookStrategy(config.fb, authProcessor));
}