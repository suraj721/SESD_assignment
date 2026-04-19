import { Router } from "express";
import { todoController } from "../controllers/todo.controller";

export const todoRouter = Router();

todoRouter.get("/", todoController.listTodos);
todoRouter.get("/stats", todoController.getStats);
todoRouter.get("/:id", todoController.getTodo);
todoRouter.post("/", todoController.createTodo);
todoRouter.put("/:id", todoController.updateTodo);
todoRouter.patch("/:id/toggle", todoController.toggleTodo);
todoRouter.delete("/:id", todoController.deleteTodo);
