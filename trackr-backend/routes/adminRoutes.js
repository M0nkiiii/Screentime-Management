// routes/adminRoutes.js
const express = require('express');
const { registerAdmin, loginAdmin, getAdminDashboardData, checkAdminEmail,
    resetAdminPassword, } = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/dashboard', authenticateToken, getAdminDashboardData);
router.post('/check-email', checkAdminEmail); // Add admin check email route
router.post('/reset-password', resetAdminPassword); // Add admin reset password route

module.exports = router;
