'use strict';

const crypto = require('crypto');

// Option 1
// exports.hello = (user) => {
//     return 'Hello ' + user;
// }

// exports.goodmorning = user =>{
//     return "Good Morning " + user;
// }


// Option 2

module.exports = function(key) {
    this.key = key;
    return {
        encode: (str) => {
            // let encoder = crypto.createCipher('aes-256-ctr', this.key);
            // return encoder.update(str, 'utf8', 'hex');
            let iv = crypto.randomBytes(32);
            let cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(this.key, 'hex'), iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return iv.toString('hex') + ':' + encrypted.toString('hex');
        },
        decode: (str) => {
            return 'Good Morning ' + user;
        }
    }
}