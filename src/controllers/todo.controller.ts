import { Request, Response } from "express";
import TodoModel from "../models/todo.model";

class TodoController {
  public getTodos = async (req: Request, res: Response) => {
    try {
      const { status, search, sort = "desc" } = req.query;
      const query: {
        status?: boolean;
        title?: { $regex: string; $options: string };
      } = {};

      if (status !== undefined) {
        if (status !== "true" && status !== "false") {
          return res
            .status(400)
            .json({ message: "status query must be true or false" });
        }
        query.status = status === "true";
      }

      if (typeof search === "string" && search.trim()) {
        query.title = { $regex: search.trim(), $options: "i" };
      }

      const sortDirection = sort === "asc" ? 1 : -1;
      const todos = await TodoModel.find(query).sort({ createdAt: sortDirection });

      return res.status(200).json({
        total: todos.length,
        filters: {
          status: query.status ?? "all",
          search: typeof search === "string" ? search : "",
          sort: sort === "asc" ? "asc" : "desc",
        },
        data: todos,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch todos" });
    }
  };

  public getTodoById = async (req: Request, res: Response) => {
    try {
      const todo = await TodoModel.findById(req.params.id);

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      return res.status(200).json(todo);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Invalid todo id" });
    }
  };

  public postTodos = async (req: Request, res: Response) => {
    try {
      const { title, status } = req.body;

      if (!title || typeof title !== "string") {
        return res
          .status(400)
          .json({ message: "title is required and must be a string" });
      }

      if (status !== undefined && typeof status !== "boolean") {
        return res.status(400).json({ message: "status must be a boolean" });
      }

      const todo = await TodoModel.create({
        title: title.trim(),
        status,
      });
      return res.status(201).json(todo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to create todo" });
    }
  };

  public updateTodo = async (req: Request, res: Response) => {
    try {
      const { title, status } = req.body;
      const updatePayload: Partial<{ title: string; status: boolean }> = {};

      if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
          return res
            .status(400)
            .json({ message: "title must be a non-empty string" });
        }
        updatePayload.title = title.trim();
      }

      if (status !== undefined) {
        if (typeof status !== "boolean") {
          return res.status(400).json({ message: "status must be a boolean" });
        }
        updatePayload.status = status;
      }

      const updatedTodo = await TodoModel.findByIdAndUpdate(
        req.params.id,
        updatePayload,
        { new: true, runValidators: true }
      );

      if (!updatedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      return res.status(200).json(updatedTodo);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Failed to update todo" });
    }
  };

  public toggleTodoStatus = async (req: Request, res: Response) => {
    try {
      const todo = await TodoModel.findById(req.params.id);

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      todo.status = !todo.status;
      await todo.save();

      return res.status(200).json(todo);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Failed to toggle todo status" });
    }
  };

  public deleteTodo = async (req: Request, res: Response) => {
    try {
      const deletedTodo = await TodoModel.findByIdAndDelete(req.params.id);

      if (!deletedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      return res.status(200).json({ message: "Todo deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Failed to delete todo" });
    }
  };

  public getTodoStats = async (_req: Request, res: Response) => {
    try {
      const [total, completed, pending] = await Promise.all([
        TodoModel.countDocuments(),
        TodoModel.countDocuments({ status: true }),
        TodoModel.countDocuments({ status: false }),
      ]);

      return res.status(200).json({
        total,
        completed,
        pending,
        completionRate: total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2)),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch todo stats" });
    }
  };
}

export default TodoController;
