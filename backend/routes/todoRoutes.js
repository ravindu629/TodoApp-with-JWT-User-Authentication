import express from "express";
const router = express.Router();
import {
  getTodoItems,
  getTodoById,
  createNewTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").get(getTodoItems).post(protect, createNewTodo);
router
  .route("/:id")
  .get(getTodoById)
  .put(protect, updateTodo)
  .delete(protect, deleteTodo);

export default router;
