import axios from "axios";

const API_CALL = "http://192.168.1.100:8000/api";

export const getFeeHistory = async () => {
  const { data } = await axios.get(`${API_CALL}/latestFees`);

  return data;
};

export const getUserByRole = async (role: string) => {
  try {
    const { data } = await axios.post(`${API_CALL}/findByRole`, { role });
    return data;
  } catch (error) {
    console.log("failed to fatch user by role", error);
  }
};

export const getUserByAddress = async (address: string) => {
  try {
    const { data } = await axios.post(`${API_CALL}/findByAddress`, { address });
    console.log("dat  1", data);

    return data;
  } catch (error) {
    console.log("failed to fatch user by role", error);
  }
};

export const getNftData = async ({tokenId,seller}:{tokenId:string,seller:string}) => {
  try {
    const { data } = await axios.post(`${API_CALL}/findNFT`, { tokenId,seller });
    console.log("dat  1", data);
    return data;
  } catch (error) {
    console.log("failed to fatch user by role", error);
  }
};