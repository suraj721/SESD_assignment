import { Document, Model } from "mongoose";

export interface TodoInterface {
  title: string;
  status: boolean;
}

export interface TodoDocument extends Document, TodoInterface {}

export type TodoModelInterface = Model<TodoDocument>;
