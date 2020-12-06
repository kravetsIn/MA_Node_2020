function myMapMethod(cb) {
  const newArray = [];

  for (let i = 0; i < this.length; i++) {
    newArray[i] = cb(this[i], i);
  }

  return newArray;
}

Array.prototype.myMap = myMapMethod;

const task3 = (data) => {
  return data.myMap((item) => {
    item.quantity = item.quantity || 0;
    item.price = item.price || item.priceForPair;

    return item;
  });
};

module.exports = task3;
