// middleware/verify-token.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];  // Expecting 'Bearer <token>'

    if (!token) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token is not valid.' });
        }
        req.user = user;  // Attach the user data to the request object
        next();
    });
};

module.exports = verifyToken;
