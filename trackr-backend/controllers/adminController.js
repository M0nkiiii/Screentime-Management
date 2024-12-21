// controllers/adminController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const UsageData = require('../models/UsageData');

// Register Admin
const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register admin' });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login Request Received:', { email });

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            console.error('Admin not found for email:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('Password Match Result:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign({ id: admin.id }, process.env.ADMIN_JWT_SECRET, { expiresIn: '1h' });
        console.log('Token Created Successfully');

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Internal Server Error in Admin Login:', error);
        res.status(500).json({ error: 'Failed to login admin' });
    }
};

// Dashboard Data
const getAdminDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalUsage = await UsageData.sum('duration');
    const popularApps = await UsageData.findAll({
      attributes: [
        'appName',
        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration'],
      ],
      group: ['appName'],
      order: [[sequelize.literal('totalDuration'), 'DESC']],
    });
    res.status(200).json({ totalUsers, totalUsage, popularApps });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Check Admin Email
const checkAdminEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      const admin = await Admin.findOne({ where: { email } });

      if (!admin) {
          return res.status(404).json({ error: 'Email not found' });
      }

      return res.status(200).json({ exists: true });
  } catch (error) {
      console.error('Error checking admin email:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
  }
};

// Reset Admin Password
const resetAdminPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
  }

  try {
      const admin = await Admin.findOne({ where: { email } });

      if (!admin) {
          return res.status(404).json({ error: 'Email not found' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      await admin.save();

      return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
      console.error('Error resetting admin password:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { registerAdmin, loginAdmin, getAdminDashboardData, checkAdminEmail, resetAdminPassword };
