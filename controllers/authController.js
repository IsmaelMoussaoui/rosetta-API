const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const User = require('../models/userModel');
const RefreshToken = require('../models/tokenModel'); // suppose you have a model for storing refresh tokens

const generateAccessToken = (user) => jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256', });

exports.validate = method => {
    switch (method) {
        case 'login':
        case 'register':
            return [
                check('email', 'Invalid or empty email').isEmail(),
                check('password', 'Invalid or empty password').exists()
            ];
        default:
            return [];
    }
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const emailN = email.toLowerCase();
        const user = await userModel.getUserByEmail(emailN);

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateAccessToken(user);
            const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET);
            await RefreshToken.create({ token: refreshToken, userId: user.id });

            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            return res.json({
                token,
                refreshToken,
                user: {
                    id: user.id,
                    createdAt: user.createdAt,
                    authEmail: user.email,
                    // profiles: ?; // TBD
                    // remainingMessages: number; // TBD
                },
            });
        }

        return res.status(404).json({ message: 'User not found or Bad credentials' });
    } catch (err) {
        return next(err);
    }
};

exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const emailN = email.toLowerCase();

        const existingUser = await userModel.getUserByEmail(emailN);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({ email: emailN, password: hashedPassword });

        const token = generateAccessToken(newUser);
        const refreshToken = jwt.sign({ id: newUser.id }, process.env.REFRESH_TOKEN_SECRET);
        await RefreshToken.create({ token: refreshToken, userId: newUser.id });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        return res.status(201).json({
            token,
            refreshToken,
            user: {
                id: newUser.id,
                createdAt: newUser.createdAt,
                authEmail: newUser.email,
                // profiles: ?; // TBD
                // remainingMessages: number; // TBD
            },
        });
    } catch (err) {
        return next(err);
    }
};

exports.refresh = async (req, res, next) => {
    const { refreshToken: oldRefreshToken } = req.body;
    if (!oldRefreshToken) return res.status(403).json({ message: 'Refresh token is required' });

    const storedToken = await RefreshToken.findOne({ token: oldRefreshToken });
    if (!storedToken) return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

        const token = generateAccessToken({ id: user.id });
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET);

        // Store the new refresh token and remove the old one
        await RefreshToken.create({ token: refreshToken, userId: user.id });
        await RefreshToken.destroy({ where: { token: oldRefreshToken } });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.json({ token, refreshToken });
    });
};

