const express = require('express');
const router = express.Router();
const { chat, getMessages } = require('../controllers/chatController');
const rateLimiter = require('../middleware/rateLimiter');
const chatController = require("../controllers/authController");

router.post('/chat',  chatController.validate('chat'), rateLimiter.rateLimiter, chat);
router.get('/chat/:profileId',  chatController.validate('chat'), rateLimiter.rateLimiter, getMessages);

module.exports = router;
