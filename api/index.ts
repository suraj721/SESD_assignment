import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp, connectDatabase } from "../src/app";
import TodoRoutes from "../src/routes/todo.routes";

const app = createApp([new TodoRoutes()]);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await connectDatabase();
  return app(req, res);
}
