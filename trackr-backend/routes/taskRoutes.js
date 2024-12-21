const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Task = require('../models/Task'); // Sequelize model for tasks
const Notification = require('../models/Notification'); // Notification model

// Add a new task
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { taskName, description, date } = req.body;
        const userId = req.user.id;

        const newTask = await Task.create({
            userId,
            taskName,
            description,
            date,
        });

        // Create a notification for the new task
        await Notification.create({
            userId,
            title: 'New Task Added',
            description: `You have added a new task: "${taskName}".`,
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error adding task:', error.message);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// Fetch tasks for a specific user
router.get('/user-tasks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.findAll({ where: { userId } });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// router.put('/mark-completed/:id', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const userId = req.user.id;

//         const task = await Task.findOne({ where: { id, userId } });
//         if (!task) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         task.completed = true;
//         await task.save();

//         res.status(200).json({ message: 'Task marked as completed', task });
//     } catch (error) {
//         console.error('Error marking task as completed:', error.message);
//         res.status(500).json({ error: 'Failed to mark task as completed' });
//     }
// });

// Mark task as completed
router.put('/mark-completed/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Find the task
        const task = await Task.findOne({ where: { id, userId } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Mark the task as completed
        task.completed = true;
        await task.save();

        // Create a notification for task completion
        await Notification.create({
            userId,
            title: 'Task Completed',
            description: `You have marked the task "${task.taskName}" as completed.`,
        });

        res.status(200).json({ message: 'Task marked as completed', task });
    } catch (error) {
        console.error('Error marking task as completed:', error.message);
        res.status(500).json({ error: 'Failed to mark task as completed' });
    }
});


module.exports = router;
