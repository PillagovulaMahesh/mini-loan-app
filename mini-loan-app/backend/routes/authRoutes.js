const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/login', authController.login);
router.get('/profile', authController.profile);

module.exports = router;
