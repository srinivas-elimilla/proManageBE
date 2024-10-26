const Task = require("../models/task.model");

const createTask = async (req, res) => {
  const {
    title,
    checklist,
    priority,
    dueDate,
    category,
    assignedTo,
    sharedWith,
  } = req.body;

  console.log(req.user);

  try {
    const task = new Task({
      title,
      checklist,
      priority,
      dueDate,
      category,
      createdBy: req.user.email,
      assignedTo,
      sharedWith,
    });
    await task.save();
    res.status(201).json({ task, message: "task created", error: false });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTasks = async (req, res) => {
  const { filter } = req.query;
  const now = new Date();
  let filterQuery = {};

  if (filter === "today") {
    filterQuery.dueDate = {
      $gte: now,
      $lt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    };
  } else if (filter === "week") {
    filterQuery.dueDate = {
      $gte: now,
      $lt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    };
  } else if (filter === "month") {
    filterQuery.dueDate = {
      $gte: now,
      $lt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    };
  }

  try {
    const tasks = await Task.find(filterQuery);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createTask, updateTask, deleteTask, getTasks };
