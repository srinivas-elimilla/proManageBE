const mongoose = require("mongoose");

const checklistSchema = new mongoose.Schema({
  text: { type: String, required: true },
  checked: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    checklist: [checklistSchema],
    priority: { type: String, required: true },
    dueDate: { type: Date },
    category: {
      type: String,
      default: "todo",
    },
    createdBy: { type: String },
    assignedTo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
