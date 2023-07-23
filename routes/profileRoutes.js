const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const {authenticate} = require("../middleware/authMiddleware");
router.use(authenticate);

router.post('/profile', authenticate, profileController.validate('createProfile'), profileController.createProfile);

module.exports = router;
