const http = require('http');

const { app } = require('./server');
const { initSetup } = require('./services');
const { enableGracefulExit } = require('./utils');

const server = http.createServer(app);

const {
  server: { PORT, HOST, NODE_ENV },
} = require('./config');

const boot = async () => {
  initSetup();
  server.listen(PORT, HOST, () => {
    const { address } = server.address();
    console.log(`Server started: http://${address}:${PORT} (${NODE_ENV})`);
  });
  enableGracefulExit(server);
};

boot();
