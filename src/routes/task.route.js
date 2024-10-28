const express = require("express");
const router = express.Router();
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getTaskAnalytics,
} = require("../controllers/task.controller");
const checkAccess = require("../middlewares/check.middleware");

router.post("/create", checkAccess, createTask);
router.put("/:taskId", checkAccess, updateTask);
router.delete("/:taskId", checkAccess, deleteTask);
router.get("/all", checkAccess, getTasks);
router.get("/analytics", checkAccess, getTaskAnalytics);

module.exports = router;
