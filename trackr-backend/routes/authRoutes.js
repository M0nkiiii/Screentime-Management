const express = require('express');
const {
  registerUser,
  loginUser,
  getUserDetails,
  getUserInfo,
  updateUserInfo,
  upload,
  checkEmail,
  resetPassword,
} = require('../controllers/authController');
const {
  checkAdminEmail,
  resetAdminPassword,
} = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.post('/register', registerUser); // No multer middleware
router.post('/login', loginUser);
router.get('/me', authenticateToken, getUserDetails);
router.get('/user', authenticateToken, getUserInfo);
router.put('/user', authenticateToken, updateUserInfo);
router.post('/check-email', checkEmail);
router.post('/reset-password', resetPassword);


// Admin Routes
router.post('/admin/check-email', checkAdminEmail);
router.post('/admin/reset-password', resetAdminPassword);

module.exports = router;
