import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DB_OPTIONS = {
      dbName: process.env.DATABASE_NAME,
    };
    await mongoose.connect(process.env.DATABASE_URL, DB_OPTIONS);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
