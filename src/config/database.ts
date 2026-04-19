import mongoose from "mongoose";
import { env } from "./env";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async () => {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongodbUri()).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
};
