const getRandomInt = (min, max) => {
  const minV = Math.ceil(min);
  const maxV = Math.floor(max);
  return Math.floor(Math.random() * (maxV - minV + 1)) + minV;
};

const generateDiscount = (callback) => {
  setTimeout(() => {
    const discount = getRandomInt(1, 99);
    if (discount < 20) callback(null, discount);
    else callback(new Error('The generated discount is too big'));
  }, 50);
};

module.exports = { generateDiscount };
