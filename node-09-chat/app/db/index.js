'use strict'

const config = require('../config');
const Mongoose = require('mongoose');

Mongoose.connection.on('error', error => {
    Console.log("MongoDB Error: " + error);
});

module.exports = {
    Mongoose
}