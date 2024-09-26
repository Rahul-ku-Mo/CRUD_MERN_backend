const express = require("express");
const taskController = require("../controllers/taskController");
const authenticateJWT = require("../middlewares/authenticate");
const router = express.Router();

router.use(authenticateJWT);

router
  .get("/", taskController.getTasks)
  .post("/", taskController.createTask)
  .put("/", taskController.editTask)
  .delete("/:id", taskController.deleteTask);

module.exports = router;
