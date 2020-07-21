'use strict'

const passport = require('passport');
const config = require('../config');
const h = require('../helpers');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = () =>{

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        h.findById(id)
        .then( user => {
            done(null, user)
        })
        .catch( error => console.error(error));
    });

    let authProcessor = (accessToken, refreshToken, profile, done) => {
        h.findOne(profile.id)
            .then( result => {

                if(result) done(null, result);
                else {
                    h.createUser(profile)
                    .then(newUser => {
                        done(null, newUser)
                    })
                    .catch(error => console.log(error)); 
                }
            })
            .catch(error => console.log(error));
    }

    passport.use(new FacebookStrategy(config.fb, authProcessor));
}