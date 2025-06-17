const express = require('express');
const router = express.Router();
const {
  getBalances,
  getSettlements,
  getPeople
} = require('../controllers/settlementController');

router.get('/balances', getBalances);
router.get('/settlements', getSettlements);
router.get('/people', getPeople);

module.exports = router;
