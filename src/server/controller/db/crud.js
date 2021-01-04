const db = require('../../../db');
const { serviceDb } = require('../../../services');

const createProduct = async (req, res, next) => {
  try {
    const { body } = req;
    const { type, color } = body;

    if (!type) {
      const err = new Error(`No product type defined`);
      err.statusCode = 400;
      throw err;
    }

    if (!color) {
      const err = new Error(`No product color defined`);
      err.statusCode = 400;
      throw err;
    }

    const createdProduct = await serviceDb.createProduct(body);
    res.send({ type: createdProduct });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const reedProduct = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      const err = new Error('No product id defined');
      err.statusCode = 400;
      throw err;
    }

    const product = await db.getProduct(id);

    if (!product || (Object.keys(product).length === 0 && product.constructor === Object))
      res.send({ message: 'Product not found' });
    else res.send({ product });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { body } = req;
    const { id } = body;

    if (!id) {
      const err = new Error('No product id defined');
      err.statusCode = 400;
      throw err;
    }

    const product = await db.updateProduct(body);
    res.send({ product });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      const err = new Error('No product id defined');
      err.statusCode = 400;
      throw err;
    }

    await db.deleteProduct(id);

    res.send({ message: `Product deleted` });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const createType = async (req, res, next) => {
  try {
    const { body } = req;
    const { name } = body;

    if (!name) {
      const err = new Error(`No type name defined`);
      err.statusCode = 400;
      throw err;
    }

    const createdType = await db.createType(name);
    res.send({ product: createdType });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const reedType = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      const err = new Error('No type id defined');
      err.statusCode = 400;
      throw err;
    }

    const type = await db.reedType(id);

    if (!type || (Object.keys(type).length === 0 && type.constructor === Object))
      res.send({ message: 'Type not found' });
    else res.send({ type });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const updateType = async (req, res, next) => {
  try {
    const { body } = req;
    const { id } = body;

    if (!id) {
      const err = new Error('No type id defined');
      err.statusCode = 400;
      throw err;
    }

    const type = await db.updateType(body);
    res.send({ type });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const deleteType = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      const err = new Error('No type id defined');
      err.statusCode = 400;
      throw err;
    }

    await db.deleteType(id);

    res.send({ message: `Type deleted` });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const createColor = async (req, res, next) => {
  try {
    const { body } = req;
    const { name } = body;

    if (!name) {
      const err = new Error(`No color name defined`);
      err.statusCode = 400;
      throw err;
    }

    const createdColor = await db.createColor(name);
    res.send({ color: createdColor });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const reedColor = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      const err = new Error('No color id defined');
      err.statusCode = 400;
      throw err;
    }

    const color = await db.getColor(id);

    if (!color || (Object.keys(color).length === 0 && color.constructor === Object))
      res.send({ message: 'Color not found' });
    else res.send({ color });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const updateColor = async (req, res, next) => {
  try {
    const { body } = req;
    const { id } = body;

    if (!id) {
      const err = new Error('No color id defined');
      err.statusCode = 400;
      throw err;
    }

    const color = await db.updateColor(body);
    res.send({ color });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const deleteColor = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      const err = new Error('No color id defined');
      err.statusCode = 400;
      throw err;
    }

    await db.deleteColor(id);

    res.send({ message: `Color deleted` });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

module.exports = {
  createProduct,
  reedProduct,
  updateProduct,
  deleteProduct,
  createType,
  reedType,
  updateType,
  deleteType,
  createColor,
  reedColor,
  updateColor,
  deleteColor,
};
