import express from "express";
import { apiRouter } from "./routes";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.get("/favicon.ico", (_req, res) => {
    res.status(204).end();
  });

  app.get("/", (_req, res) => {
    res.status(200).json({
      name: "SESD Todo API",
      message: "API is running",
      endpoints: {
        health: "/health",
        todos: "/api/todos",
        stats: "/api/todos/stats",
      },
    });
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api", apiRouter);

  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  return app;
};
