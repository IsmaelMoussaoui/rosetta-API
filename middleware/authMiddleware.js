const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    console.log(req.path);
    if (req.path === '/refresh') {
        next();
    } else {
        console.log("Authenticate middleware triggered");
        const token = req.cookies.token;
        console.log(token)
        if (!token) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {algorithm: 'HS256'});
            console.log("Decoded token: ", decodedToken);
            req.user = {userId: decodedToken.id};
            console.log(req.user)

            next();
        } catch (error) {
            console.error('Error verifying JWT', error);
            return res.status(401).json({message: 'Unauthorized'});
        }
    }
};
