const http = require('http');

const {
  server: { PORT, HOST, NODE_ENV },
} = require('./config');
const { app } = require('./server');
const { initSetup } = require('./services');
const { enableGracefulExit } = require('./utils');
const db = require('./db');

const server = http.createServer(app);

const boot = async () => {
  try {
    await db.init();
    console.log(`Now DB type is ${db.getType()}`);

    // db.setType('knex');
    // console.log(`Now DB type is ${db.getType()}`);

    enableGracefulExit(server, db);
    await initSetup();

    server.listen(PORT, HOST, () => {
      const { address } = server.address();
      console.log(`Server started: http://${address}:${PORT} (${NODE_ENV})`);
    });
  } catch (err) {
    console.error(`ERROR in boot(): ${err.message || err}`);
  }
};

boot();
