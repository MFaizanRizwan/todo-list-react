import TaskModel from '../models/TaskModel.js';

export const create = async (req, res) => {
  const taskData = req.body;
  try {
    await TaskModel.addTask(taskData);
    res.send('Task created successfully!');
  } catch (error) {
    res.status(500).send('Error creating task');
  }
};

export const getTasksByUser = async (req, res) => {
  const username = req.params.username;
  try {
    const tasks = await TaskModel.getTaskbyUsername(username);
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Error retrieving tasks for user');
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.getTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Error retrieving tasks');
  }
};

export const getTaskById = async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await TaskModel.getTaskById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.json(task);
  } catch (error) {
    res.status(500).send('Error retrieving task');
  }
};

export const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const updatedData = req.body;
  try {
    await TaskModel.updateTask(taskId, updatedData);
    res.send(`Task with ID ${taskId} updated successfully!`);
  } catch (error) {
    res.status(500).send('Error updating task');
  }
};

export const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    await TaskModel.deleteTask(taskId);
    res.send(`Task with ID ${taskId} deleted successfully!`);
  } catch (error) {
    res.status(500).send('Error deleting task');
  }
};

