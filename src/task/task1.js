function task1(data, key, value) {
  if (!Array.isArray(data)) {
    throw new Error('"data" must be a array');
  }

  if (typeof key !== 'string') {
    throw new Error('"key" must be a string');
  }

  return data.filter((item) => item[key] === value);
}

module.exports = task1;
