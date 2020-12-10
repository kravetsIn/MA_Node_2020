const http = require('http');

const {
  server: { PORT, HOST, NODE_ENV },
  db: dbConfig,
} = require('./config');
const { app } = require('./server');
const { initSetup } = require('./services');
const { enableGracefulExit } = require('./utils');
const db = require('./db')(dbConfig);

const server = http.createServer(app);

const boot = async () => {
  try {
    await db.testConnection();
    enableGracefulExit(server, db);
    initSetup();

    server.listen(PORT, HOST, () => {
      const { address } = server.address();
      console.log(`Server started: http://${address}:${PORT} (${NODE_ENV})`);
    });
  } catch (err) {
    console.error(`ERROR in boot(): ${err.message || err}`);
  }
};

boot();
