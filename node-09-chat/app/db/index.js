'use strict'
const config = require("../config");
const Mongoose = require('mongoose');

Mongoose.connect(config.dbURI, {useNewUrlParser: true})

// Mongoose.connection.on('error', error => {
//     Console.log("MongoDB Error: " + error);
// });

const chatUser = Mongoose.Schema({
    profileId: String,
    fullName: String,
    profilePic: String
});

let userModel = Mongoose.model('chatUser', chatUser);

module.exports = {
    Mongoose,
    userModel
}