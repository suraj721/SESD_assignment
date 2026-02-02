import { Request, Response } from "express";
import TodoModel from "../models/todo.model";

class TodoController {
  public getTodos = async function (req: Request, res: Response) {
    res.status(200).json("Hello");
  };

  public postTodos = async function (req: Request, res: Response) {
    console.log(req.body);
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
        title,
        status,
      });
      return res.status(201).json(todo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to create todo" });
    }
  };
}

export default TodoController;
