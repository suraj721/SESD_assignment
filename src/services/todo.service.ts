import { isValidObjectId } from "mongoose";
import { TodoModel } from "../models/todo.model";

type ListTodoOptions = {
  completed?: boolean;
  search?: string;
  priority?: "low" | "medium" | "high";
  sort?: "asc" | "desc";
};

type TodoPayload = {
  title?: unknown;
  description?: unknown;
  completed?: unknown;
  priority?: unknown;
};

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const validatePriority = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  throw new Error("priority must be low, medium, or high");
};

export const todoService = {
  async list(options: ListTodoOptions) {
    const query: Record<string, unknown> = {};

    if (options.completed !== undefined) {
      query.completed = options.completed;
    }

    if (options.priority) {
      query.priority = options.priority;
    }

    if (options.search) {
      query.$or = [
        { title: { $regex: options.search, $options: "i" } },
        { description: { $regex: options.search, $options: "i" } },
      ];
    }

    const sortDirection = options.sort === "asc" ? 1 : -1;

    return TodoModel.find(query).sort({
      createdAt: sortDirection,
      updatedAt: sortDirection,
    });
  },

  async getById(id: string) {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid todo id");
    }

    return TodoModel.findById(id);
  },

  async create(payload: TodoPayload) {
    const title = normalizeText(payload.title);
    const description = normalizeText(payload.description);

    if (!title) {
      throw new Error("title is required");
    }

    if (
      payload.completed !== undefined &&
      typeof payload.completed !== "boolean"
    ) {
      throw new Error("completed must be a boolean");
    }

    return TodoModel.create({
      title,
      description,
      completed: payload.completed,
      priority: validatePriority(payload.priority),
    });
  },

  async update(id: string, payload: TodoPayload) {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid todo id");
    }

    const updateData: Record<string, unknown> = {};

    if (payload.title !== undefined) {
      const title = normalizeText(payload.title);

      if (!title) {
        throw new Error("title must be a non-empty string");
      }

      updateData.title = title;
    }

    if (payload.description !== undefined) {
      updateData.description = normalizeText(payload.description);
    }

    if (payload.completed !== undefined) {
      if (typeof payload.completed !== "boolean") {
        throw new Error("completed must be a boolean");
      }

      updateData.completed = payload.completed;
    }

    if (payload.priority !== undefined) {
      updateData.priority = validatePriority(payload.priority);
    }

    return TodoModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  },

  async toggle(id: string) {
    const todo = await this.getById(id);

    if (!todo) {
      return null;
    }

    todo.completed = !todo.completed;
    await todo.save();

    return todo;
  },

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid todo id");
    }

    return TodoModel.findByIdAndDelete(id);
  },

  async getStats() {
    const [total, completed, highPriority] = await Promise.all([
      TodoModel.countDocuments(),
      TodoModel.countDocuments({ completed: true }),
      TodoModel.countDocuments({ priority: "high" }),
    ]);

    const pending = total - completed;

    return {
      total,
      completed,
      pending,
      highPriority,
      completionRate: total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2)),
    };
  },
};
