const { app } = require('./server');
const { initSetup } = require('./services');

const {
  server: { PORT, HOST, NODE_ENV },
} = require('./config');

const serverInit = () => {
  const server = app.listen(PORT, HOST, () => {
    const { address } = server.address();
    console.log(`Server started: http://${address}:${PORT} (${NODE_ENV})`);
  });

  const stop = (callback) => {
    server.close((err) => {
      if (err) {
        console.log(err, 'Failed to close server!');
        callback();
        return;
      }

      console.log('Server has beeb stopped');
      callback();
    });
  };

  const exitHandler = (error) => {
    if (error) console.error(error);

    console.log('Gracefully stopping...');
    stop(() => {
      process.exit();
    });
  };

  // Catches ctrl+c event
  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);

  // Catches "kill pid"
  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);

  // Catches uncaught/unhandled exceptions
  process.on('uncaughtException', exitHandler);
  process.on('unhandledRejection', exitHandler);
};

const boot = () => {
  initSetup();
  serverInit();
};

boot();
