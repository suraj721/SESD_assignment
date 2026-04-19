import express from "express";
import { connect } from "mongoose";
import { Routes } from "./utils/route.Interface";

let databaseConnectionPromise: Promise<typeof import("mongoose")> | null = null;

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  if (!databaseConnectionPromise) {
    databaseConnectionPromise = connect(uri).catch((error) => {
      databaseConnectionPromise = null;
      throw error;
    });
  }

  await databaseConnectionPromise;
};

export const createApp = (routes: Routes[]) => {
  const app = express();

  app.use(express.json());

  app.get("/favicon.ico", (_req, res) => {
    res.status(204).end();
  });

  app.get("/", (_req, res) => {
    res.status(200).json({
      name: "Todo API",
      message: "API is running",
      endpoints: {
        health: "/health",
        todos: "/todo/allTodos",
        stats: "/todo/stats",
      },
    });
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  routes.forEach((route) => {
    app.use("/", route.router);
  });

  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  return app;
};

export const startServer = async (routes: Routes[]) => {
  const app = createApp(routes);
  const port = process.env.PORT || 8080;

  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
