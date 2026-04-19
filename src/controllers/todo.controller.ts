import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import TodoModel from "../models/todo.model";

type TodoFilterQuery = {
  status?: boolean;
  title?: { $regex: string; $options: string };
};

const parseStatusFilter = (value: unknown) => {
  if (value === undefined) {
    return { isValid: true as const };
  }

  if (value === "true" || value === "false") {
    return { isValid: true as const, value: value === "true" };
  }

  return { isValid: false as const };
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

class TodoController {
  public listTodos = async (req: Request, res: Response) => {
    try {
      const { status, search, sort = "desc" } = req.query;
      const query: TodoFilterQuery = {};
      const statusFilter = parseStatusFilter(status);

      if (!statusFilter.isValid) {
        return res
          .status(400)
          .json({ message: "status query must be true or false" });
      }

      if (statusFilter.value !== undefined) {
        query.status = statusFilter.value;
      }

      if (isNonEmptyString(search)) {
        query.title = { $regex: search.trim(), $options: "i" };
      }

      const sortDirection = sort === "asc" ? 1 : -1;
      const todos = await TodoModel.find(query).sort({ createdAt: sortDirection });

      return res.status(200).json({
        total: todos.length,
        filters: {
          status: query.status ?? "all",
          search: isNonEmptyString(search) ? search.trim() : "",
          sort: sort === "asc" ? "asc" : "desc",
        },
        data: todos,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch todos" });
    }
  };

  public getTodo = async (req: Request, res: Response) => {
    try {
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid todo id" });
      }

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

  public createTodo = async (req: Request, res: Response) => {
    try {
      const { title, status } = req.body;

      if (!isNonEmptyString(title)) {
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
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid todo id" });
      }

      const { title, status } = req.body;
      const updatePayload: Partial<{ title: string; status: boolean }> = {};

      if (title !== undefined) {
        if (!isNonEmptyString(title)) {
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
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid todo id" });
      }

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
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid todo id" });
      }

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

  public getStats = async (_req: Request, res: Response) => {
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
