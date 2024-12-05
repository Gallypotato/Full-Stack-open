import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const request = await axios.get(baseUrl, config);
    return request.data;
  } catch (error) {
    console.error(
      "Error fetching blogs (get ALL):",
      error.response ? error.response.data : error,
    ); 
    throw error;
  }
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const like = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const request = axios.put(`${baseUrl}/${id}`, newObject, config);
    return (await request).data;
  } catch (error) {
    console.error("Error updating likes:", error.response || error);
    throw error;
  }
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const request = axios.delete(`${baseUrl}/${id}`, config);
    return (await request).data;
  } catch (error) {
    console.error("Error removing blogs:", error.response || error);
    throw error;
  }
};

const comment = async (id, comment) => {
  try{
    const response = await axios.post(`${baseUrl}/${id}/comments`, { comment });
    return response.data;
  }catch (error) {
    console.error("Error adding comment:", error.response || error);
    throw error;
  }
};
export default { getAll, setToken, create, like, remove, comment };
