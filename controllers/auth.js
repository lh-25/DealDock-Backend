const jwt = require('jsonwebtoken');

// Helper function to create a token
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Signup or SignIn Handler Example
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user);

    res.cookie('token', token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production', // Ensures HTTPS in production
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    res.status(201).json({ message: 'Account created successfully', user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// SignOut Handler
const signout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Signed out successfully' });
};

module.exports = {
    signup,
    signout
}