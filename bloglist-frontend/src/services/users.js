import axios from "axios";

const baseUrl = "/api/users"; // Adjust to your backend endpoint

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export default { getAll };