const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to Verify JWT Token
exports.verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Authorization" header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded user info to the request object

    // Check if user exists
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token', error });
  }
};

// Middleware to Check Admin Role
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};


const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const loanController = require('../controllers/loanController');

const router = express.Router();

// Routes for all users (authenticated)
router.post('/create', verifyToken, loanController.createLoan);
router.get('/', verifyToken, loanController.getUserLoans);

// Admin-only routes
router.put('/approve/:loanId', verifyToken, isAdmin, loanController.approveLoan);

module.exports = router;
