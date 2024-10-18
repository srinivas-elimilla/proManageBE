const User = require("../models/User");
const { generateToken } = require("../utils/generate.token");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "email existed" });
    }

    const newUser = await User.create({ name, email, password });
    newUser.save();
    if (newUser) {
      const token = generateToken(newUser._id);

      res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token,
        message: "user created",
      });
    } else {
      res.status(400).json({ message: "user not created!" });
    }
  } catch (error) {
    console.log("error >>>>>>", error);

    res.status(500).json({ message: "server error" });
  }
};

module.exports = { register };
