import axios from "axios";

const API_CALL = "http://10.98.0.173:8000/api";



export const getFeeHistory = async () => {
  const { data } = await axios.get(`${API_CALL}/latestFees`);
  
  return data;
};
