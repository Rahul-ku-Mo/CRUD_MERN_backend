const express = require("express");
const columnController = require("../controllers/columnController");
const authenticateJWT = require("../middlewares/authenticate");

const router = express.Router();

router.use(authenticateJWT);

router.post("/", columnController.createColumn);

module.exports = router;
