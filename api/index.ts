import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp, connectDatabase } from "../src/app";
import TodoRoutes from "../src/routes/todo.routes";

const app = createApp([new TodoRoutes()]);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const requestPath = req.url || "/";
    const needsDatabase = requestPath.startsWith("/todo");

    if (needsDatabase) {
      await connectDatabase();
    }

    return app(req, res);
  } catch (error) {
    console.error("Vercel handler error:", error);

    const message =
      error instanceof Error ? error.message : "Unexpected server error";

    return res.status(500).json({
      message: "Server error",
      error: message,
    });
  }
}
