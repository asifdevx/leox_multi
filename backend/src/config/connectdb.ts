import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connetdb = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.log(error);
  }
};
export default connetdb;
