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

    default:
      return notFound(response);
  }
}

module.exports = { handleRoutes };
