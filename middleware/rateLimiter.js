const rateLimit = require("express-rate-limit");
const jwt = require('jsonwebtoken');

const createLimiter = (max) => rateLimit({
    windowMs: 6 * 30 * 24 * 60 * 60 * 1000, // 6 months
    max, // start blocking after max requests
    message: "Too many requests from this IP, please try again after an hour"
});

const guestLimiter = createLimiter(6);
const userLimiter = createLimiter(Infinity); // Or any other high number for registered users

exports.rateLimiter = (req, res, next) => {
    let token = req.cookies.token;

    if (!token) {
        // If the user is not authenticated, use guestLimiter
        return guestLimiter(req, res, next);
    }

    // If the user is authenticated, use userLimiter
    jwt.verify(token, process.env.JWT_SECRET, {algorithm: 'HS256'}, function(err, decodedToken) {
        if (err) {
            // If the token is not valid, treat as a guest
            return guestLimiter(req, res, next);
        } else {
            // If the token is valid, treat as a user
            req.user = { userId: decodedToken.id };
            return userLimiter(req, res, next);
        }
    });
};
