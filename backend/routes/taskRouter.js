const taskRouter = require("express").Router();
const { accessTokenValidate } = require("../middleswares/accessTokenValidate");
const {
  addTask,
  showTask,
  dropTask,
  showDroppedTasks,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");

taskRouter.post("/add", accessTokenValidate, addTask);
taskRouter.get("/show", accessTokenValidate, showTask);
taskRouter.patch("/drop", accessTokenValidate, dropTask);
taskRouter.get("/dropped", accessTokenValidate, showDroppedTasks);
taskRouter.post("/delete", accessTokenValidate, deleteTask);
taskRouter.put("/update/:id", accessTokenValidate, updateTask);

module.exports = taskRouter;
