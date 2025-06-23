import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import entryRoutes from "./routes/entryRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);

// Start server after DB connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
