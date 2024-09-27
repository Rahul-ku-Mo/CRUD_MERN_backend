const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .post("/register", authController.register)
  .post("/login", authController.login)
  .get("/google", authController.googleAuth)
  .get("/google/callback", authController.googleAuthCallback)
  .post("/exchange-token", authController.exchangeToken)

module.exports = router;
