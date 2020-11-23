const { parse: parseQuery } = require('querystring');
const { URL } = require('url');
const config = require('../config');
const router = require('./router');

module.exports = async (request, response) => {
  try {
    const origin = config.server.ORIGIN;

    const { url } = request;
    const parseUrl = new URL(url, origin);
    const queryParams = parseQuery(parseUrl.search.substr(1));

    let body = [];

    request
      .on('error', (err) => {
        console.log(err);
      })
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();

        router(
          {
            ...request,
            body: body ? JSON.parse(body) : {},
            parseUrl,
            queryParams,
          },
          response,
        );
      });
  } catch (error) {
    console.log(error);
  }
};
