import axios from "axios";

const API_CALL = "http://192.168.2.108:8000/api";



export const getFeeHistory = async () => {
  const { data } = await axios.get(`${API_CALL}/latestFees`);
  
  return data;
};
