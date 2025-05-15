import product from "../schemas/product.schema";

export const productData = async () => {
  try {
    const products = await product.find();

    return products.map((doc) => ({
      id: doc.id as number,
      title: doc.title as string,
      description: doc.description as string,
    }));
  } catch (error) {
    throw new Error("Failed to fetch products from MongoDB");
  }
};

export const addProductData = async (
  id: number,
  title: string,
  description: string
) => {
  try {
    const newProduct = new product({
      id,
      title,
      description,
    });

    await newProduct.save();

    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Error adding product to the database");
  }
};
