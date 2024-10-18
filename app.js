const express = require("express");
const cors = require("cors");
const authRoute = require("./src/routes/auth.route");

const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/auth", authRoute);

module.exports = app;
