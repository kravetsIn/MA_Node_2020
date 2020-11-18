function task3(data) {
  return data.map((item) => {
    item.quantity = item.quantity || 0;
    item.price = item.price || item.priceForPair;

    return item;
  });
}

module.exports = task3;
