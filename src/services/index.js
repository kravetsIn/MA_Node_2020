const task = require('./tasks');
const store = require('./store');
const discount = require('./discount');
const initSetup = require('./initAppSetup');
const serviceDb = require('./db');

module.exports = { discount, task, store, initSetup, serviceDb };
