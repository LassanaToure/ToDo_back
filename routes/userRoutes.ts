const express = require("express");
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/update", authMiddleware, userController.updateUser);
router.delete("/delete", authMiddleware, userController.deleteUser);

export default router;
