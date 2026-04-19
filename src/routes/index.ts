import { Router } from "express";
import { todoRouter } from "./todo.routes";

export const apiRouter = Router();

apiRouter.use("/todos", todoRouter);
