const { home, expensiveProduct, filterData, setData, formatDataHandler } = require('./controller');

function notFound(res) {
  // res.setHeader('Content-Type', 'application/json');
  res.statusCode = 404;
  // res.write('404');
  res.end();
}

module.exports = (request, response) => {
  const { method, queryParams, body: data, parseUrl } = request;

  if (method === 'GET' && parseUrl.pathname === '/') return home(response, queryParams);
  if (method === 'GET' && parseUrl.pathname === '/filter') return filterData(response, queryParams);
  if (method === 'GET' && parseUrl.pathname === '/max') return expensiveProduct(response);
  if (method === 'POST' && parseUrl.pathname === '/set-data')
    return setData(data, response, queryParams);
  if (method === 'GET' && parseUrl.pathname === '/format-data')
    return formatDataHandler(response, queryParams);

  return notFound(response);
};
