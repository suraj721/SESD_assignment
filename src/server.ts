import App from "./app";
import TodoRoutes from "./routes/todo.routes";
import "dotenv/config";

const app = new App([new TodoRoutes()]);
app.startServer();
