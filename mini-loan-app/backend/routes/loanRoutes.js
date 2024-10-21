const express = require('express');
const loanController = require('../controllers/loanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Loan routes (User and Admin)
router.post('/create', verifyToken, loanController.createLoan);         // User creates loan
router.get('/', verifyToken, loanController.getUserLoans);              // User views own loans
router.put('/approve/:loanId', verifyToken, isAdmin, loanController.approveLoan); // Admin approves loan

module.exports = router;
