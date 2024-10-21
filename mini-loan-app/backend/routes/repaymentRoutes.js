const express = require('express');
const repaymentController = require('../controllers/repaymentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Repayment routes (User)
router.post('/add', verifyToken, repaymentController.addRepayment); // Add a repayment
router.get('/:loanId', verifyToken, repaymentController.getLoanRepayments); // View repayments for a loan

module.exports = router;
