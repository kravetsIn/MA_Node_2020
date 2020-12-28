const router = require('express').Router();

const { db: dbController } = require('../../../controller');

const {
  createProduct,
  reedProduct,
  updateProduct,
  deleteProduct,
  csv2db,
  getAllProducts,
} = dbController;

router.get('/reed', reedProduct);
router.get('/delete', deleteProduct);
router.get('/allproducts', getAllProducts);

router.post('/update', updateProduct);
router.post('/create', createProduct);

router.put('/csv', csv2db);

module.exports = router;
