import { Router } from "express";
import { Routes } from "../utils/route.Interface";
import TodoController from "../controllers/todo.controller";

class TodoRoutes implements Routes {
  path?: string = "/todo";
  router: Router = Router();
  private todoController = new TodoController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/stats`, this.todoController.getStats);
    this.router.get(`${this.path}/allTodos`, this.todoController.listTodos);
    this.router.get(`${this.path}/:id`, this.todoController.getTodo);
    this.router.post(`${this.path}/add`, this.todoController.createTodo);
    this.router.put(`${this.path}/:id`, this.todoController.updateTodo);
    this.router.patch(
      `${this.path}/:id/toggle`,
      this.todoController.toggleTodoStatus
    );
    this.router.delete(`${this.path}/:id`, this.todoController.deleteTodo);
  }
}

export default TodoRoutes;
