import { model, Schema } from "mongoose";
import { TodoDocument, TodoModelInterface } from "../utils/todo.interface";

const todoSchema = new Schema({
    title: {
        type: String
    },
    status: {
        type: Boolean
    }
})

const TodoModel = model<TodoDocument, TodoModelInterface>('Todo', todoSchema);

export default TodoModel;