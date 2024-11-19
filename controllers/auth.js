// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user'); 

// const router = express.Router();  


// const createToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
// };

// const signup = async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Username or email already exists' });
//     }

//     const user = await User.create({ username, email, password });
//     const token = createToken(user);

//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.status(201).json({ message: 'Account created successfully', user: { id: user._id, username: user.username } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error during signup' });
//   }
// };


// const signout = (req, res) => {
//   res.clearCookie('token');
//   res.json({ message: 'Signed out successfully' });
// };


// router.post('/signup', signup);
// router.post('/signout', signout);


// module.exports = router;
