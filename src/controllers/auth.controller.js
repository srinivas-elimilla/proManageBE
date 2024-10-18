const User = require("../models/user.model");
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
      const token = generateToken(newUser._id); // useful auto login

      res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        // token,  no need for now
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

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("logging in error >>>>>>>", error);
    res.status(500).json({ message: "server error" });
  }
};

const update = async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const fieldsProvided = [name, email, newPassword && oldPassword].filter(
      Boolean
    ).length;

    if (fieldsProvided > 1) {
      return res.status(400).json({
        message:
          "only one field (name, email, or password) can be updated at a time.",
      });
    }

    if (name) {
      user.name = name;
      await user.save();
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "name updated successfully",
        logout: true,
      });
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "email already in use" });
      }
      user.email = email;
      await user.save();
      return res.status(200).json({
        message: "email updated successfully, please log in again.",
        logout: true,
      });
    }

    if (oldPassword && newPassword) {
      const isPasswordCorrect = await user.matchPassword(oldPassword);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "old password is incorrect" });
      }

      user.password = newPassword;
      await user.save();
      return res.status(200).json({
        message: "password updated successfully, please log in again.",
        logout: true,
      });
    }

    res.status(400).json({ message: "no valid field provided for update." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = { register, login, update };