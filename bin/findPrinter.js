require('dotenv').config();

const findPrinter = require('../dist/printer').findPrinter;

console.log(findPrinter('citizen'));
