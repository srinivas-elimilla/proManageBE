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

  try {
    const task = new Task({
      title,
      checklist,
      priority,
      dueDate: dueDate ? new Date(dueDate).getTime() : null,
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
  delete req?.body?.id;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ updatedTask, message: "task updated", error: false });
  } catch (error) {
    res.status(400).json({ message: error.message, error: true });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ message: "task deleted", error: false });
  } catch (error) {
    res.status(400).json({ message: error.message, error: true });
  }
};

const getTasks = async (req, res) => {
  const { filter } = req.query;
  const now = Date.now();
  let endTime;

  switch (filter) {
    case "today":
      endTime = now + 24 * 60 * 60 * 1000;
      break;
    case "week":
      endTime = now + 7 * 24 * 60 * 60 * 1000;
      break;
    case "month":
      endTime = now + 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      endTime = null;
  }

  const filterQuery = {
    $or: [{ createdBy: req.user.email }, { assignedTo: req.user.email }],
  };

  try {
    const tasks = await Task.find(filterQuery);
    console.log(tasks.length);

    const filteredTasks = tasks.filter((task) => {
      if (endTime) {
        return (
          task.dueDate === null ||
          (task.dueDate >= now && task.dueDate < endTime)
        );
      }
      return true;
    });

    res.status(200).json(filteredTasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTaskAnalytics = async (req, res) => {
  try {
    const filterQuery = {
      $or: [{ createdBy: req.user.email }, { assignedTo: req.user.email }],
    };

    const tasks = await Task.find(filterQuery);

    const analytics = {
      backlogCount: 0,
      doneCount: 0,
      progressCount: 0,
      todoCount: 0,
      highPriorityCount: 0,
      moderatePriorityCount: 0,
      lowPriorityCount: 0,
      dueDateCount: 0,
    };

    analytics.backlogCount = tasks.filter(
      (task) => task.category === "backlog"
    ).length;
    analytics.doneCount = tasks.filter(
      (task) => task.category === "done"
    ).length;
    analytics.progressCount = tasks.filter(
      (task) => task.category === "progress"
    ).length;
    analytics.todoCount = tasks.filter(
      (task) => task.category === "todo"
    ).length;
    analytics.highPriorityCount = tasks.filter(
      (task) => task.priority === "high"
    ).length;
    analytics.moderatePriorityCount = tasks.filter(
      (task) => task.priority === "moderate"
    ).length;
    analytics.lowPriorityCount = tasks.filter(
      (task) => task.priority === "low"
    ).length;
    analytics.dueDateCount = tasks.filter(
      (task) => task.dueDate !== null
    ).length;

    res.json({
      message: "analytics fetched",
      analytics,
      error: false,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "server error", err: error.message, error: true });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getTaskAnalytics,
  getTaskById,
};
