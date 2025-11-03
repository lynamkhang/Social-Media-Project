import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("DB Connected!");
  } catch (error) {
    process.exit(1);
  }
};
