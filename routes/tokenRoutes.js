const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/refresh', authController.refresh);

module.exports = router;
