import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface User extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  emailCode: number | null;
  isEmailVerified: boolean;
  todos: string[];
  password: string;
}

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailCode: {
      type: Number,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<User, Model<User>>("User", userSchema);
