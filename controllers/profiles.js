const express = require('express');
const router = express.Router();  // Ensure router is defined
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');  // Assuming you have a middleware to verify the JWT token

// Get a user's profile
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        // Ensure the logged-in user is the same as the user they are trying to access
        if (req.user._id.toString() !== req.params.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find the user by their ID
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;  // Export the router so it can be used in server.js
