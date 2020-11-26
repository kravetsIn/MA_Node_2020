const { Transform } = require('stream');

function createCsvToJson() {
  let isFirst = true;
  const transform = (chunk, encoding, callback) => {
    if (isFirst) {
      isFirst = false;
      callback(null, 'JSON string\n');
      return;
    }

    callback(null, 'JSON string\n');
  };

  const flush = (callback) => {
    console.log('No more data to read.');
    callback(null, '\nFinish!');
  };

  return new Transform({ transform, flush });
}

module.exports = createCsvToJson;
