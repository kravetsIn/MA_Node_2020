const { parse: parseQuery } = require('querystring');

const {
  home,
  expensiveProduct,
  filterData,
  setData,
  formatDataHandler,
  setDefaultData,
  notFound,
  discountHandlerCallback,
  promiseHandler,
  asyncHandler,
  uploadCsv,
  uploadsList,
  optimizeJson,
} = require('./controller');

function handleRoutes(request, response) {
  const {
    method,
    body: data,
    url: { pathname, search },
  } = request;
  const queryParams = parseQuery(search.substr(1));

  switch (true) {
    case method === 'GET' && pathname === '/':
      return home(response);

    case method === 'GET' && pathname === '/filter':
      return filterData(response, queryParams);

    case method === 'GET' && pathname === '/max':
      return expensiveProduct(response);

    case method === 'GET' && pathname === '/set-default':
      return setDefaultData(response);

    case method === 'POST' && pathname === '/set-data':
      return setData(data, response, queryParams);

    case method === 'GET' && pathname === '/format-data':
      return formatDataHandler(response, queryParams);

    case method === 'GET' && pathname === '/callback':
      return discountHandlerCallback(response);

    case method === 'GET' && pathname === '/promise':
      return promiseHandler(response);

    case method === 'GET' && pathname === '/async':
      return asyncHandler(response);

    case method === 'GET' && pathname === '/store/list':
      return uploadsList(response);

    case method === 'POST' && pathname === '/optimize':
      return optimizeJson(data, response);

    default:
      return notFound(response);
  }
}

async function handleStreamRoutes(request, response) {
  const { url, method } = request;

  if (method === 'PUT' && url === '/store/csv') {
    try {
      await uploadCsv(request);
    } catch (err) {
      console.error(err);

      response.setHeader('Content-type', 'application/json');
      response.statusCode = 500;
      response.end(JSON.stringify({ status: 'error' }));
      return;
    }
  }

  response.setHeader('Content-type', 'application/json');
  response.statusCode = 200;
  response.end(JSON.stringify({ status: 'ok' }));
}

module.exports = { handleRoutes, handleStreamRoutes };
