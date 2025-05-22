const express = require("express");
const emailController = require("../controllers/emailController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send", authMiddleware, emailController.sendEmailVerificationCode);
router.post("/verify", authMiddleware, emailController.verifyEmail);

export default router;
