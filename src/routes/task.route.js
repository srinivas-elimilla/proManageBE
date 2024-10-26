const express = require("express");
const router = express.Router();
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} = require("../controllers/task.controller");
const checkAccess = require("../middlewares/check.middleware");

router.post("/create", checkAccess, createTask);
router.put("/:taskId", checkAccess, updateTask);
router.delete("/:taskId", checkAccess, deleteTask);
router.get("/all", checkAccess, getTasks);

module.exports = router;
