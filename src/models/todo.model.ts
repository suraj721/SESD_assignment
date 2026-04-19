import { model, Schema } from "mongoose";
import { TodoDocument, TodoModelInterface } from "../utils/todo.interface";

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const TodoModel = model<TodoDocument, TodoModelInterface>("Todo", todoSchema);

export default TodoModel;
