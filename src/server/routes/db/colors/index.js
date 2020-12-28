const router = require('express').Router();
const { db: dbController } = require('../../../controller');

const { createColor, reedColor, updateColor, deleteColor } = dbController;

router.get('/reed', reedColor);
router.get('/delete', deleteColor);

router.post('/update', updateColor);
router.post('/create', createColor);

module.exports = router;
