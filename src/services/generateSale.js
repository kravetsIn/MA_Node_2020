const util = require('util');

function getRandomInt(min, max) {
  const minV = Math.ceil(min);
  const maxV = Math.floor(max);
  return Math.floor(Math.random() * (maxV - minV + 1)) + minV;
}

function generateDiscount(callback) {
  setTimeout(() => {
    const discount = getRandomInt(1, 99);
    if (discount < 20) callback(null, discount);
    else callback(new Error('The generated discount is too big'));
  }, 50);
}

// Future Callback hell
generateDiscount((err, discount) => {
  try {
    if (!err) {
      console.log(`Discount value: ${discount}`);
    } else throw new Error(err);
  } catch (e) {
    console.log(e.message);
  }
});

// Promise wrapper for callback
const promisify = () =>
  new Promise((resolve, reject) => {
    generateDiscount((err, discount) => {
      if (!err) resolve(discount);
      else reject(new Error(err));
    });
  });

promisify()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// Promise wrapper for callback, use util
const utilPromisify = util.promisify(generateDiscount);

utilPromisify()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// Async/await wrapper for callback
async function generateDiscountAsync() {
  const result = await new Promise((resolve, reject) => {
    generateDiscount((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

  return result;
}

async function asyncHandler() {
  try {
    const res = await generateDiscountAsync();
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

asyncHandler();
