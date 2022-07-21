const express = require('express');
const router = express.Router()
const tran = require('../controller/transactioncontroller')





router.get('/show', tran.showtransaction)
router.post('/transaction', tran.transaction)
router.post('/balance', tran.balance)
module.exports = router;