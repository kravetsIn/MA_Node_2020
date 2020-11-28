const { URL } = require('url');
const config = require('../config');
const { handleRoutes, handleStreamRoutes } = require('./router');

function getBody(body) {
  if (body.length === 0) return {};

  const bodyString = Buffer.concat(body).toString();

  try {
    return JSON.parse(bodyString);
  } catch (err) {
    console.error('Failed to parse', err);
  }

  return {};
}

function handle(request, response) {
  try {
    if (request.headers['content-type'] === 'application/csv+gzip') {
      handleStreamRoutes(request, response).catch((err) => {
        console.error('CSV handler failed', err);
      });

      return;
    }

    request.on('error', (err) => console.log(err));

    const bodyChunks = [];
    request.on('data', (chunk) => bodyChunks.push(chunk));

    request.on('end', () => {
      const origin = config.server.ORIGIN;
      const url = new URL(request.url, origin);
      const body = getBody(bodyChunks);

      const customRequest = { ...request, body, url };
      handleRoutes(customRequest, response);
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = handle;
