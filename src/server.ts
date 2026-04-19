import { startServer } from "./application";
import TodoRoutes from "./routes/todo.routes";
import "dotenv/config";

startServer([new TodoRoutes()]);
