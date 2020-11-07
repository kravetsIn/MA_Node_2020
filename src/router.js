const {
  home,
  expensiveProduct,
  filterData,
  setData,
  formatDataHandler,
  setDefaultData,
  notFound,
} = require('./controller');

module.exports = (request, response) => {
  const { method, queryParams, body: data, parseUrl } = request;

  if (method === 'GET' && parseUrl.pathname === '/') return home(response);
  if (method === 'GET' && parseUrl.pathname === '/filter') return filterData(response, queryParams);
  if (method === 'GET' && parseUrl.pathname === '/max') return expensiveProduct(response);
  if (method === 'GET' && parseUrl.pathname === '/set-default') return setDefaultData(response);
  if (method === 'POST' && parseUrl.pathname === '/set-data')
    return setData(data, response, queryParams);
  if (method === 'GET' && parseUrl.pathname === '/format-data')
    return formatDataHandler(response, queryParams);

  return notFound(response);
};
