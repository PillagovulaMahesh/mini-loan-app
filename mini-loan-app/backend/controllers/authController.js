const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// User Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

// Get Current User Profile
exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'username'] });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
