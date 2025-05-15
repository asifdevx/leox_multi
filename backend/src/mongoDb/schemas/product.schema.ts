import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
  },

  { timestamps: true }
);


const product =mongoose.model("product",productSchema);

export default product
