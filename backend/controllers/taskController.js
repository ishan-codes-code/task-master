const taskModel = require("../models/taskModel");
const projectModel = require("../models/projectModel");

const addTask = async (req, res) => {
  try {
    const taskData = req.body;

    const task = new taskModel({
      ...taskData,
      userId: req.user._id,
    });

    const savedTask = await task.save();

    let updatedProject;

    if (req.body.projectId != null) {
      const project = await projectModel.findById(req.body.projectId);

      project.tasks.push(savedTask._id);
      updatedProject = await project.save();
      if (!updatedProject) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Errorr",
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Task created successfullyyyy",
      project: updatedProject,
      task: savedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const showTask = async (req, res) => {
  // console.log(req.user);
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (page === 0) {
    try {
      const tasks = await taskModel
        .find({
          userId: req.user._id,
          isDeleted: false,
        })
        .sort({ createdAt: -1 });
      const pTasks = await taskModel
        .find({
          userId: req.user._id,
          isDeleted: false,
          projectId: { $ne: null },
        })
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, tasks, pTasks });
    } catch (error) {
      console.error("Error in showTask:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    try {
      const [tasks, total, completed] = await Promise.all([
        taskModel
          .find({ userId: req.user._id, isDeleted: false })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        taskModel.countDocuments({ userId: req.user._id, isDeleted: false }),
        taskModel.countDocuments({
          userId: req.user._id,
          isDeleted: false,
          isCompleted: true,
        }),
      ]);

      // Debug logs
      // console.log("Tasks:", tasks);
      // console.log("Total:", total);
      // console.log("Completed:", completed);

      res.status(200).json({
        success: true,
        tasks,
        total,
        completed,
      });
    } catch (error) {
      console.error("Error in showTask:", error); // Add this too
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};

const dropTask = async (req, res) => {
  const taskId = req.query.id;
  // console.log("id:", taskId);

  try {
    const task = await taskModel.findByIdAndUpdate(taskId, {
      $set: { isDeleted: true },
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task moved to bin" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const showDroppedTasks = async (req, res) => {
  try {
    const droppedTasks = await taskModel
      .find({ userId: req.user._id, isDeleted: true })
      .sort({ createdAt: -1 });
    if (!droppedTasks) {
      return res
        .status(404)
        .json({ success: false, message: "No dropped tasks" });
    }
    res.status(200).json({ success: true, droppedTasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.body.id;
  // console.log(req.body);
  try {
    const deleteTasks = await taskModel.deleteMany({ _id: { $in: taskId } });
    if (!deleteTasks) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedTask = await taskModel.findByIdAndUpdate(taskId, updatedData, {
      new: true,
    });
    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task edited", updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addTask,
  showTask,
  dropTask,
  showDroppedTasks,
  deleteTask,
  updateTask,
};
