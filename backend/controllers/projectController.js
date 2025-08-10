const projectModel = require("../models/projectModel");
const taskModel = require("../models/taskModel");

const showProjects = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const [projects, total, completed] = await Promise.all([
      projectModel
        .find({ userId: req.user._id, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      projectModel.countDocuments({ userId: req.user._id, isDeleted: false }),
      projectModel.countDocuments({
        userId: req.user._id,
        isDeleted: false,
        isCompleted: true,
      }),
    ]);
    res.status(200).json({
      success: true,
      projects,
      total,
      completed,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addProject = async (req, res) => {
  let tasks;
  try {
    tasks = await taskModel.insertMany(
      req.body.tasks
        .filter((task) => task.title && task.title.trim() !== "")
        .map((task) => ({
          userId: req.user._id,
          title: task.title.trim(),
        }))
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  let savedProject; // Declare it in the outer scope
  let pTasks;
  try {
    const project = new projectModel({
      title: req.body.pTitle,
      desc: req.body.pDesc,
      dueDate: req.body.pDueDate,
      userId: req.user._id,
      priority: req.body.priority,
      tasks: tasks.map((task) => task._id),
    });

    savedProject = await project.save(); // Now assign it here

    const taskIds = tasks.map((task) => task._id);

    try {
      await taskModel.updateMany(
        { _id: { $in: taskIds } },
        { $set: { projectId: project._id } }
      );
      pTasks = await taskModel.find({ _id: { $in: taskIds } });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  res
    .status(200)
    .json({ message: "Project added", project: savedProject, pTasks: pTasks });
};

const showPTasks = async (req, res) => {
  const pId = req.query.id;
  try {
    const tasks = await taskModel.find({ projectId: pId });
    res.status(200).json({ tasks });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProject = async (req, res) => {
  const projectId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      updatedData,
      {
        new: true,
      }
    );
    if (!updatedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Project edited", updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  const project = req.body;
  const userId = req.user._id;

  if (project.userId !== userId) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }
  try {
    const deleteProject = await projectModel.deleteOne({ _id: project._id });
    if (!deleteProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    try {
      const deletePTasks = await taskModel.deleteMany({
        projectId: project._id,
      });
      if (!deletePTasks) {
        return res
          .status(404)
          .json({ success: false, message: "Tasks not found" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addProject,
  showProjects,
  showPTasks,
  updateProject,
  deleteProject,
};
