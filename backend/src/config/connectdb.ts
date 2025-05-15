import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connetdb = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("database is undefind");
    }
    console.log("i am connect with backend server");

    await mongoose.connect(mongoUri);
  } catch (error) {
    console.log(error);
  }
};
export default connetdb;
