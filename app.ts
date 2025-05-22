import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import emailRoutes from "./routes/emailRoutes";
import todoRoutes from "./routes/todoRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/todos", todoRoutes);

export default app;
