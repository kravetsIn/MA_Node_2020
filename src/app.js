const { app } = require('./server');
const { initSetup } = require('./services');
const { enableGracefulExit } = require('./utils');

const {
  server: { PORT, HOST, NODE_ENV },
} = require('./config');

const boot = async () => {
  initSetup();
  const server = app.listen(PORT, HOST, () => {
    const { address } = server.address();
    console.log(`Server started: http://${address}:${PORT} (${NODE_ENV})`);
  });
  enableGracefulExit(server);
};

boot();
