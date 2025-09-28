import axios from "axios";

const API_CALL = "http://192.168.0.100:8000/api";

export const getFee = async () => {
  const data = await axios.get(`${API_CALL}/fee`);
  console.log("getFee",data);
  
  return data.data;
};


