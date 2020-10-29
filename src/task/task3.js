function task3(data) {
  const dataKeys = [];

  data.forEach((item) => {
    Object.keys(item).forEach((itemKey) => {
      if (dataKeys.indexOf(itemKey) === -1) {
        dataKeys.push(itemKey);
      }
    });
  });

  return data.map((item) => {
    for (let i = 0; i < dataKeys.length; i += 1) {
      if (!(dataKeys[i] in item)) {
        item[dataKeys[i]] = dataKeys[i];
      }
    }

    return item;
  });
}

module.exports = task3;
