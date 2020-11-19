const {
  home,
  expensiveProduct,
  filterData,
  setData,
  formatDataHandler,
  setDefaultData,
  notFound,
  saleHandlerCallback,
} = require('./controller');

module.exports = (request, response) => {
  const {
    method,
    queryParams,
    body: data,
    parseUrl: { pathname },
  } = request;

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
      return saleHandlerCallback(response);

    default:
      return notFound(response);
  }
};
