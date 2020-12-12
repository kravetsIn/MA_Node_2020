const router = require('express').Router();

const {
  db: { createProduct, reedProduct, updateProduct, deleteProduct },
} = require('../controller');

router.get('/reed', reedProduct);
router.get('/delete', deleteProduct);

router.post('/update', updateProduct);
router.post('/create', createProduct);

module.exports = router;
