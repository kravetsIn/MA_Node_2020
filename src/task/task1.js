function task1(data, key, value) {
  if (!Array.isArray(data)) {
    console.error('"data" must be a array');
    return null;
  }

  if (typeof key !== 'string') {
    console.error('"param1" must be a string');
    return null;
  }

  return data.filter((item) => item[key] === value);
}

module.exports = task1;
