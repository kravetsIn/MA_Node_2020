const router = require('express').Router();
const { db: dbController } = require('../../../controller');

const { createType, reedType, updateType, deleteType } = dbController;

router.get('/reed', reedType);
router.get('/delete', deleteType);

router.post('/update', updateType);
router.post('/create', createType);

module.exports = router;
