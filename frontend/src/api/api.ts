import axios from "axios";

const API_CALL = "http://192.168.0.101:8000/api";

export const getFee = async () => {
  const data = await axios.get(`${API_CALL}/fee`);
  console.log("getFee",data);
  
  return data.data;
};

export const updateFee = async (fee: number) => {
  const res = await axios.post(`${API_CALL}/updateFee`, { fee });
  console.log(res.data);

  return res.data;
};
