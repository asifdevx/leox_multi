import axios from "axios";

export const fetchMetadata = async (tokenURI: string) => {
  if (!tokenURI) return { name: "", description: "", image: "" };

  try {
    const ipfsCID = tokenURI.replace("ipfs://", "");
    const { data } = await axios.get(`https://crimson-odd-woodpecker-368.mypinata.cloud/ipfs/${ipfsCID}`);

    const imageUrl = data.image?.startsWith("ipfs://")
      ? `https://crimson-odd-woodpecker-368.mypinata.cloud/ipfs/${data.image.replace("ipfs://", "")}`
      : data.image || "";   
      console.log("cid",`https://crimson-odd-woodpecker-368.mypinata.cloud/ipfs/${ipfsCID}`);
       
      console.log(`https://crimson-odd-woodpecker-368.mypinata.cloud/ipfs/${data.image.replace("ipfs://", "")}`,"img");

       
    return {
      name: data.name,
      description: data.description || "No description available",
      image: imageUrl,
    };
  } catch (error: any) {
    console.warn("Failed to fetch metadata", tokenURI, error.message);
    return { name: "", description: "", image: "" };
  }
};
