'user strict'

// const enigma = require('./enigma');

const Enigma = require('./enigma');
const eng = new Enigma('magrathea');

let encodedString = eng.encode("Don't Panic");

console.log("Encoded: ", encodedString);