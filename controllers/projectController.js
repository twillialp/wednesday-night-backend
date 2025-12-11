const Project = require('../models/Project');
const Task = require('../models/Task');

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
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

    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user: req.user._id,
    });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
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

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
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

    // Delete tasks
    await Task.deleteMany({ project: projectId });
    await Project.findByIdAndDelete(projectId);

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};