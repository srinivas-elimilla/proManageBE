const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch((error) => console.log("DB Connection error >>>>>>>>>>>", error));
};

module.exports = connectDB;
