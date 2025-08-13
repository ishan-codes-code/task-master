const projectRouter = require("express").Router();
const { accessTokenValidate } = require("../middleswares/accessTokenValidate");
const {
  showProjects,
  addProject,
  showPTasks,
  updateProject,
  deleteProject,
  deletePTasks,
} = require("../controllers/projectController");

projectRouter.get("/show", accessTokenValidate, showProjects);
projectRouter.post("/add", accessTokenValidate, addProject);
projectRouter.get("/showPTasks", accessTokenValidate, showPTasks);
projectRouter.put("/update/:id", accessTokenValidate, updateProject);
projectRouter.post("/delete", accessTokenValidate, deleteProject);
projectRouter.post("/deletePTasks", accessTokenValidate, deletePTasks);

module.exports = projectRouter;
