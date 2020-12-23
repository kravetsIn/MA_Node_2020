require('dotenv').config();

const { fatal } = require('../utils');

module.exports = {
  path: {
    uploads: './uploads',
    optimize: './uploads/optimize',
  },
  server: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3000,
    ORIGIN: process.env.ORIGIN || 'http://localhost:3000',
  },
  db: {
    user: process.env.DB_USER || fatal('FATAL: DB_USER is not defined'),
    host: process.env.DB_HOST || fatal('FATAL: DB_HOST is not defined'),
    port: process.env.DB_PORT || fatal('FATAL: DB_PORT is not defined'),
    database: process.env.DB_NAME || fatal('FATAL: DB_NAME is not defined'),
    password: process.env.DB_PASS || fatal('FATAL: DB_PASS is not defined'),
  },
  users: {
    Masters: 'Academy',
  },
};
