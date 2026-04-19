import express from "express";
import path from "path";
import { apiRouter } from "./routes";

export const createApp = () => {
  const app = express();
  const publicPath = path.join(process.cwd(), "public");

  app.use(express.json());
  app.use(express.static(publicPath));

  app.get("/favicon.ico", (_req, res) => {
    res.status(204).end();
  });

  app.get("/", (_req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api", apiRouter);

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    return res.sendFile(path.join(publicPath, "index.html"));
  });

  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  return app;
};
