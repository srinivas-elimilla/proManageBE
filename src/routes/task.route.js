const express = require("express");
const router = express.Router();
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getTaskAnalytics,
  getTaskById,
} = require("../controllers/task.controller");
const checkAuth = require("../middlewares/check.middleware");

router.post("/create", checkAuth, createTask);
router.put("/:taskId", checkAuth, updateTask);
router.delete("/:taskId", checkAuth, deleteTask);
router.get("/all", checkAuth, getTasks);
router.get("/analytics", checkAuth, getTaskAnalytics);
router.get("/:taskId", getTaskById);

module.exports = router;
