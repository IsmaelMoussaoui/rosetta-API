const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.validate('login'), authController.login);
router.post('/register', authController.validate('register'), authController.register);


module.exports = router;
