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

  // console.log(req.user);

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
  const now = new Date();
  let filterQuery = {
    $or: [{ createdBy: req.user.email }, { assignedTo: req.user.email }],
  };

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
  console.log(filterQuery);

  try {
    const tasks = await Task.find(filterQuery);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTaskAnalytics = async (req, res) => {
  try {
    const analytics = await Task.aggregate([
      {
        $facet: {
          backlogCount: [
            { $match: { category: "backlog" } },
            { $count: "count" },
          ],
          doneCount: [{ $match: { category: "done" } }, { $count: "count" }],
          progressCount: [
            { $match: { category: "progress" } },
            { $count: "count" },
          ],
          todoCount: [{ $match: { category: "todo" } }, { $count: "count" }],
          highPriorityCount: [
            { $match: { priority: "high" } },
            { $count: "count" },
          ],
          moderatePriorityCount: [
            { $match: { priority: "moderate" } },
            { $count: "count" },
          ],
          lowPriorityCount: [
            { $match: { priority: "low" } },
            { $count: "count" },
          ],
          dueDateCount: [
            { $match: { dueDate: { $ne: null } } },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          backlogCount: { $arrayElemAt: ["$backlogCount.count", 0] },
          doneCount: { $arrayElemAt: ["$doneCount.count", 0] },
          progressCount: { $arrayElemAt: ["$progressCount.count", 0] },
          todoCount: { $arrayElemAt: ["$todoCount.count", 0] },
          highPriorityCount: { $arrayElemAt: ["$highPriorityCount.count", 0] },
          moderatePriorityCount: {
            $arrayElemAt: ["$moderatePriorityCount.count", 0],
          },
          lowPriorityCount: { $arrayElemAt: ["$lowPriorityCount.count", 0] },
          dueDateCount: { $arrayElemAt: ["$dueDateCount.count", 0] },
        },
      },
    ]);

    res.json({
      message: "analytics fetched",
      analytics: analytics[0] || {
        backlogCount: 0,
        doneCount: 0,
        progressCount: 0,
        todoCount: 0,
        highPriorityCount: 0,
        moderatePriorityCount: 0,
        lowPriorityCount: 0,
        dueDateCount: 0,
      },
      error: false,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "server error", err: error.message, error: true });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getTaskAnalytics,
};
