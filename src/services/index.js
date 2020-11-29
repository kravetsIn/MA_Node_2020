const tasks = require('./tasks');
const { generateDiscount, utilPromisify } = require('./generateSale');
const initSetup = require('./initAppSetup');

module.exports = { tasks, generateDiscount, utilPromisify, initSetup };
