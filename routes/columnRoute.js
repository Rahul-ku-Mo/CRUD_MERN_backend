const express = require("express");
const columnController = require("../controllers/columnController");
const authenticateJWT = require("../middlewares/authenticate");

const router = express.Router();

router.use(authenticateJWT);

router
  .post("/", columnController.createColumn)
  .get("/", columnController.getColumns)
  .put("/orderTasks", columnController.updateTaskInColumns)
  .put("/:id", columnController.editColumn)
  .delete("/:id", columnController.deleteColumn)

module.exports = router;
