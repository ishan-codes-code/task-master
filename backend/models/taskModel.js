const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
   
    dueDate: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    date: {
      // creation date or assigned date
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  },
);
const taskModel = mongoose.model("Task", taskSchema);
module.exports = taskModel;
