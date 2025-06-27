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
  // console.log(req.body.addTasks);
  if (req.body.addTasks.length > 0) {
    try {
      const tasks = await taskModel.insertMany(
        req.body.addTasks.map((task) => ({
          title: task.title,
          desc: task.description,
          dueDate: req.body.pDueDate,
          userId: req.user._id,
        })),
      );
      req.body.tasks = [...req.body.tasks, ...tasks.map((task) => task)];
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  try {
    const project = new projectModel({
      title: req.body.pTitle,
      desc: req.body.pDesc,
      dueDate: req.body.pDueDate,
      userId: req.user._id,
      tasks: req.body.tasks.map((task) => task._id),
    });
    await project.save();
    const taskIds = req.body.tasks.map((task) => task._id);
    try {
      await taskModel.updateMany(
        { _id: { $in: taskIds } },
        { $set: { projectId: project._id } },
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  res.status(200).json({ message: "Project added" });
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
      },
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
