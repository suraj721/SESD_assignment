import express from "express";
import { createApp, connectDatabase } from "../src/application";
import TodoRoutes from "../src/routes/todo.routes";

const app = express();

app.use(async (req, res, next) => {
  try {
    if (req.path.startsWith("/todo")) {
      await connectDatabase();
    }
    next();
  } catch (error) {
    console.error("Vercel middleware error:", error);

    const message =
      error instanceof Error ? error.message : "Unexpected server error";

    res.status(500).json({
      message: "Server error",
      error: message,
    });
  }
});

app.use(createApp([new TodoRoutes()]));

export default app;
