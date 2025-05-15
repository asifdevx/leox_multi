import axios from "axios";


export const productData = async () => {
  try {
    const res = await axios.get("https://dummyjson.com/product");
    const filteredProducts =await  res.data.products.map((product:any)=>({
      id:product.id,
      title:product.title,
      description:product.description
    }))
    return filteredProducts;
  } catch (error) {
    console.log(error);
  }
};
