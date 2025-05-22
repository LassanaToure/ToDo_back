import mongoose, { Document, Schema, Model } from "mongoose";

export interface Todo extends Document {
  title: string;
  description: string;
  completed: boolean;
  owner: string;
}

const todoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<Todo, Model<Todo>>("Todo", todoSchema);
