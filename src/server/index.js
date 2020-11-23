const http = require('http');
const config = require('../config');
const requestHandler = require('./requestHandler');

const server = http.createServer(requestHandler);

function start() {
  const port = config.server.PORT;
  const host = config.server.HOST;

  server.listen(port, host, () => {
    console.log(
      `Server started: [${server.address().address}]:${server.address().port} (${
        process.env.NODE_ENV
      })`,
    );
  });
}

function stop(callback) {
  server.close((err) => {
    if (err) {
      console.log(err, 'Failed to close server!');
      callback();
      return;
    }

    console.log('Server has beeb stopped');
    callback();
  });
}

module.exports = { start, stop };
