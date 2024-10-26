const express = require("express");
const cors = require("cors");
const authRoute = require("./src/routes/auth.route");
const taskRoute = require("./src/routes/task.route");

const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/auth", authRoute);
app.use("/task", taskRoute);

module.exports = app;
