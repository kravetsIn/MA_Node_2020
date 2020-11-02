function task3(data) {
  return data.map((item) => {
    item.quantity = item.quantity || null;
    item.price = item.price || item.priceForPair || null;

    return item;
  });
}

module.exports = task3;
