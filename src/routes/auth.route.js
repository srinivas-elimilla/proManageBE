const express = require("express");
const {
  register,
  login,
  update,
  getUser,
  getUsers,
} = require("../controllers/auth.controller");
const checkAccess = require("../middlewares/check.middleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get", checkAccess, getUser);
router.get("/all", checkAccess, getUsers);
router.put("/update", checkAccess, update);

module.exports = router;
