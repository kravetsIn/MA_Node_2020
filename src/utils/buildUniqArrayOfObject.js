const { Transform } = require('stream');

function buildUniqArrayOfObject() {
  const uniqItems = {};
  let lastStr = '';

  const getUniqItem = (strArr) => {
    strArr.forEach((line) => {
      if (line === '[' || line === ']') return;
      // eslint-disable-next-line no-param-reassign
      if (line[line.length - 1] === ',') line = line.slice(0, -1);

      // eslint-disable-next-line no-param-reassign
      line = line.trim();
      const product = JSON.parse(line);

      // Generate Uniq key
      let itemKey = JSON.parse(JSON.stringify(product));
      itemKey.quantity = undefined;
      itemKey = JSON.stringify(itemKey);

      if (uniqItems[itemKey]) uniqItems[itemKey].quantity += product.quantity;
      else uniqItems[itemKey] = product;
    });
  };

  const transform = (chunk, encoding, callback) => {
    const strArray = chunk.toString().split('\n');

    // Fix line break
    strArray[0] = lastStr + strArray[0];
    lastStr = strArray.pop();

    getUniqItem(strArray);
    callback();
  };

  const flush = (callback) => {
    const items = Object.values(uniqItems);
    const { length } = items;
    let optimizedItems = '';

    items.forEach((item, index) => {
      const isLastItem = index === length - 1;
      if (isLastItem) {
        optimizedItems += `\t${JSON.stringify(item)}\n`;
        return;
      }
      optimizedItems += `\t${JSON.stringify(item)},\n`;
    });

    callback(null, `[\n${optimizedItems}]`);
  };

  return new Transform({ transform, flush });
}

module.exports = buildUniqArrayOfObject;
