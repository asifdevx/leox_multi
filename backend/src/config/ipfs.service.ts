import axios from "axios";

export const fetchMetadata = async (tokenURI: string) => {
  if (!tokenURI) return { name: "", description: "", image: "" };

  try {
    const ipfsCID = tokenURI.replace("ipfs://", "");
    const { data } = await axios.get(`https://nftstorage.link/ipfs/${ipfsCID}`);

    const imageUrl = data.image?.startsWith("ipfs://")
      ? `https://nftstorage.link/ipfs/${data.image.replace("ipfs://", "")}`
      : data.image || "";
      console.log(data.name,data.description,imageUrl);
      
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
