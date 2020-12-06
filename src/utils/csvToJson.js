const { Transform } = require('stream');

const jsonGenerator = (array, keys) => {
  return array.reduce((acc, red) => {
    const jsonString = red.split(',').map((item, index) => {
      // eslint-disable-next-line no-restricted-globals
      const isStringType = !(!isNaN(Number(item)) || item === 'true' || item === 'false');
      const val = isStringType ? `"${item}"` : item;
      return `"${keys[index]}":${val}`;
    });

    // Replace price if isPair: true
    if (jsonString[4] === '"isPair":true') {
      jsonString[3] = `"priceForPair":${jsonString[3].split(':')[1]}`;
    }

    // Remove "isPair" line
    jsonString.length -= 1;

    return `${acc},\n\t{${jsonString} }`;
  }, '');
};

const createCsvToJson = () => {
  let isFirst = true;
  let keys = [];
  let lastStr = '';

  const transform = (chunk, encoding, callback) => {
    const strArray = chunk.toString().split('\n');

    // Fix line break
    strArray[0] = lastStr + strArray[0];
    lastStr = strArray.pop();

    if (isFirst) {
      keys = strArray.shift().split(',');
      // creating json and removing comma on first line
      const json = jsonGenerator(strArray, keys).slice(1);
      callback(null, `[${json}`);
      isFirst = false;
      return;
    }

    callback(null, jsonGenerator(strArray, keys));
  };

  const flush = (callback) => {
    callback(null, '\n]');
  };
  return new Transform({ transform, flush });
};

module.exports = createCsvToJson;
