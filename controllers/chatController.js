const ChatModel = require('../models/chatModel');
const { Configuration, OpenAIApi } = require("openai");
const { check, validationResult } = require('express-validator');
const {Op} = require("sequelize");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const formatMessage = (message) => ({
    id: message.id,
    profileId: message.profileId,
    createdAt: message.createdAt,
    content: message.content,
    author: message.isAI ? 'ai' : 'user'
});

exports.validate = method => {
    switch (method) {
        case 'chat':
            return [
                check('message', 'Invalid or empty message').exists(),
                check('profileId', 'Invalid or empty profileId').exists()
            ];
        default:
            return [];
    }
}

exports.chat = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { message, profileId } = req.body;
    const userId = req.user ? req.user.userId : null;

    try {
        const userMessage = await ChatModel.create({
            content: message,
            userId: userId,
            profileId: profileId,
            isAI: false
        });

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "user", content: message}
            ],
        });

        const aiResponse = completion.data.choices[0].message.content;

        const chatMessage = await ChatModel.create({
            content: aiResponse,
            isAI: true,
            userId: userId,
            profileId: profileId
        });

        res.json(formatMessage(chatMessage));

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while sending the message' });
        console.error(error);
    }
};

exports.getMessages = async (req, res, next) => {
    const profileId = req.params.profileId;
    const userId = req.user ? req.user.userId : null;

    try {
        const messages = await ChatModel.findAll({
            where: {
                profileId: profileId,
                userId: userId
            }
        });

        if (!messages) {
            return res.status(404).json({ message: 'No messages found for this profile.' });
        }

        res.json({ messages: messages.map(formatMessage) });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving the messages' });
        console.error(error);
    }
};
