const Task = require('../models/Task');
const Project = require('../models/Project');

const getAllTasks = async (req, res) => {
  try {
    // Get project id
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ message: `Project with id: ${projectId} not found.` });
    }

    // Authorization
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Not authorized.' });
    }

    // Get tasks
    const tasks = await Task.find({ project: projectId });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id: ${taskId} not found.` });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res
        .status(404)
        .json({ message: 'Project not found for this task.' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Not authorized.' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden: Not authorized' });
    }

    const task = await Task.create({
      ...req.body,
      project: projectId,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error('CREATE TASK ERROR:', error);
    return res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Check if task exists
    const task = await Task.findById(taskId);

    const project = await Project.findById(task.project);

    if (!project) {
      return res
        .status(404)
        .json({ message: 'Project not found for this task.' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Not authorized.' });
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ error: `Task with id: ${taskId} not found.` });
    }
    const project = await Project.findById(task.project);
    if (!project) {
      return res
        .status(404)
        .json({ error: 'Task does not Belong to any project!' });
    }
    if (project.user.toString() === req.user._id) {
      const deletedTask = await Task.findByIdAndDelete(taskId);
      res.status(200).json(deletedTask);
    } else {
      res.status(400).json({ error: 'You have no access to this task' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};