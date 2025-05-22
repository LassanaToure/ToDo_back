const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { checkTodoOwner } = require("../middleware/checkTodoOwner");
const todoController = require("../controllers/todoController");

const router = express.Router();

router.get("/", authMiddleware, todoController.getTodos);
router.post("/", authMiddleware, todoController.createTodo);
router.put("/:id", authMiddleware, checkTodoOwner, todoController.updateTodo);
router.delete(
  "/:id",
  authMiddleware,
  checkTodoOwner,
  todoController.deleteTodo
);

export default router;
