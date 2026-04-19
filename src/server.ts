import { createApp } from "./application";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async () => {
  try {
    await connectDatabase();

    const app = createApp();
    app.listen(env.port, () => {
      console.log(`Server listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
