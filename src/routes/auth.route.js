const express = require("express");
const { register, login, update } = require("../controllers/auth.controller");
const checkAccess = require("../middlewares/check.middleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", checkAccess, update);

module.exports = router;
