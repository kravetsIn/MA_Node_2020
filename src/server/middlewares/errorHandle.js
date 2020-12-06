// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;

  switch (err.statusCode) {
    case 403:
      return res.status(403).json({ error: 'Access is denied!' });

    case 404:
      return res.status(404).write('<h1>Not Found</h1>');

    case 500:
      return res.status(500).json({ error: 'Server Error!' });

    default:
      return res.status(err.statusCode).json({ error: err.message || true });
  }
};

module.exports = errorHandler;
