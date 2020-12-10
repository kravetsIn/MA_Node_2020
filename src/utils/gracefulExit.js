const enableGracefulExit = (server, db) => {
  const exitHandler = async (error) => {
    if (error) console.error(error);

    if (db) await db.close();

    server.close((err) => {
      if (err) console.error('ERROR: Server shutdown error!', err);

      console.log('Gracefully stopping...');
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

module.exports = enableGracefulExit;
