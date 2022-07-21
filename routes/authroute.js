const express = require('express');
const router = express.Router();
const auth = require('../controller/authcontroller')

router.post('/registered', auth.authentication)
router.post('/verify' , auth.verify)
router.post('/validate', auth.validate)
module.exports = router