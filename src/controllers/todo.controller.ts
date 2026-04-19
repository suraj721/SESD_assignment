import { Request, Response } from "express";
import { todoService } from "../services/todo.service";

const sendBadRequest = (res: Response, error: unknown) => {
  const message = error instanceof Error ? error.message : "Invalid request";
  return res.status(400).json({ message });
};

const getRouteId = (value: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export const todoController = {
  async listTodos(req: Request, res: Response) {
    try {
      const { completed, search, priority, sort } = req.query;

      if (
        completed !== undefined &&
        completed !== "true" &&
        completed !== "false"
      ) {
        return res
          .status(400)
          .json({ message: "completed query must be true or false" });
      }

      const todos = await todoService.list({
        completed: completed === undefined ? undefined : completed === "true",
        search: typeof search === "string" ? search.trim() : undefined,
        priority:
          priority === "low" || priority === "medium" || priority === "high"
            ? priority
            : undefined,
        sort: sort === "asc" ? "asc" : "desc",
      });

      return res.status(200).json({
        count: todos.length,
        data: todos,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch todos" });
    }
  },

  async getTodo(req: Request, res: Response) {
    try {
      const todo = await todoService.getById(getRouteId(req.params.id));

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      return res.status(200).json(todo);
    } catch (error) {
      return sendBadRequest(res, error);
    }
  },

  async createTodo(req: Request, res: Response) {
    try {
      const todo = await todoService.create(req.body);
      return res.status(201).json(todo);
    } catch (error) {
      return sendBadRequest(res, error);
    }
  },

  async updateTodo(req: Request, res: Response) {
    try {
      const todo = await todoService.update(getRouteId(req.params.id), req.body);

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      return res.status(200).json(todo);
    } catch (error) {
      return sendBadRequest(res, error);
    }
  },

  async toggleTodo(req: Request, res: Response) {
    try {
      const todo = await todoService.toggle(getRouteId(req.params.id));

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      return res.status(200).json(todo);
    } catch (error) {
      return sendBadRequest(res, error);
    }
  },

  async deleteTodo(req: Request, res: Response) {
    try {
      const todo = await todoService.remove(getRouteId(req.params.id));

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      return res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
      return sendBadRequest(res, error);
    }
  },

  async getStats(_req: Request, res: Response) {
    try {
      const stats = await todoService.getStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch stats" });
    }
  },
};
