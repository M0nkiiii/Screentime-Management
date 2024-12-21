const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
// const UsageData = require('../models/UsageData');
const { Sequelize } = require('sequelize');
const { getUsageData, updateUsageData, getWeeklyUsage, getDailyUsage, triggerPrediction } = require('../controllers/usageController');
const { protect } = require('../middleware/authMiddleware');
const { User, UsageData } = require('../models/associations'); 


// Route to track screen usage
router.post('/track', authenticateToken, async (req, res) => {
    try {
        const { appName, duration } = req.body;

        if (!appName || !duration) {
            return res.status(400).json({ error: 'App name and duration are required' });
        }

        const userId = req.user.id;

        const usageRecord = await UsageData.create({
            userId,
            appName,
            duration,
        });

        res.status(201).json({ message: 'Usage tracked successfully', usageRecord });
    } catch (error) {
        console.error(`Error tracking usage for user:`, error.message);
        res.status(500).json({ error: 'Failed to track usage' });
    }
});

// Route to fetch dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Fetching dashboard data for user:', userId);

        const totalScreenTime = await UsageData.sum('duration', { where: { userId } });
        const appUsage = await UsageData.findAll({
            where: { userId },
            attributes: [
                'appName',
                [Sequelize.fn('SUM', Sequelize.col('duration')), 'totalTime'],
            ],
            group: ['appName'],
            order: [[Sequelize.literal('totalTime'), 'DESC']],
        });

        res.status(200).json({ totalScreenTime, appUsage });
    } catch (error) {
        console.error(`Error fetching dashboard data for user ${userId}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

router.get('/admin-dashboard', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching total users...');
        const totalUsers = await User.count();

        console.log('Fetching user usage data...');
        const userUsageData = await UsageData.findAll({
            attributes: [
                'userId',
                [Sequelize.fn('SUM', Sequelize.col('duration')), 'totalDuration'],
            ],
            include: [
                {
                    model: User,
                    attributes: ['username'], // Include username here
                    as: 'user',
                },
            ],
            group: ['userId', 'user.id'],
            order: [[Sequelize.literal('totalDuration'), 'DESC']],
        });

        console.log('Fetching app usage data...');
        const appUsageData = await UsageData.findAll({
            attributes: [
                'appName',
                [Sequelize.fn('SUM', Sequelize.col('duration')), 'totalDuration'],
            ],
            group: ['appName'],
            order: [[Sequelize.literal('totalDuration'), 'DESC']],
        });

        console.log('Successfully fetched data.');
        res.status(200).json({ totalUsers, userUsageData, appUsageData });
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error.message);
        res.status(500).json({ error: 'Failed to fetch admin dashboard data' });
    }
});

router.post('/extension-data', authenticateToken, async (req, res) => {
    try {
        const { usageData } = req.body;

        if (!usageData || !Array.isArray(usageData)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        const savedData = await UsageData.bulkCreate(
            usageData.map((data) => ({
                userId: req.user.id,
                appName: data.appName || 'Unknown',
                duration: data.duration || 0,
                timestamp: data.timestamp || new Date(),
            }))
        );

        res.status(201).json({ message: 'Usage data saved successfully', savedData });
    } catch (error) {
        console.error('Error saving usage data:', error.message);
        res.status(500).json({ error: 'Failed to save usage data' });
    }
});



//fetch weekly usage data 


// Route to get usage data
router.get('/usage', getUsageData); // Make sure 'getUsageData' is defined

// Route to update usage data
router.put('/usage', updateUsageData); // Make sure 'updateUsageData' is defined

// Weekly usage route
router.get('/weekly/:userId', authenticateToken, getWeeklyUsage);

// Route to fetch daily usage
router.get('/daily/:userId', authenticateToken, getDailyUsage);

// Route to trigger prediction
router.get('/predict/:userId', authenticateToken, triggerPrediction);




module.exports = router;
