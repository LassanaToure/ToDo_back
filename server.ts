import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI non défini dans les variables d'environnement");
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
