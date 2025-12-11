const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const taskRouter = express.Router();

// Protects all rotes in this router
taskRouter.use(authMiddleware);

/**
 * GET /api/Tasks
 */
taskRouter.get('/projects/:projectId/tasks', getAllTasks);

/**
 * GET /api/Tasks/:taskId
 */
taskRouter.get('/projects/:projectId/tasks/:taskId', getTaskById);

/**
 * POST /api/Tasks
 */
taskRouter.post('/projects/:projectId/tasks', createTask);

/**
 * PUT /api/Tasks/taskId
 */
taskRouter.put('/projects/:projectId/tasks/:taskId', updateTask);

/**
 * DELETE /api/Tasks/taskId
 */
taskRouter.delete('/projects/:projectId/tasks/:taskId', deleteTask);

module.exports = taskRouter;