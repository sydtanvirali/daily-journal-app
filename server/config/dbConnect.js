import mongoose from "mongoose";

const connectDB = async (connectionString) => {
  try {
    if (!connectionString) {
      throw new Error("MONGODB_URI is not defined!");
    }
    await mongoose.connect(connectionString, {
      dbName: "DailyJournalDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
