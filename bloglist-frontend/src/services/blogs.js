import axios from 'axios'
const baseUrl = '/api/blogs'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  try{
    const request = await axios.get(baseUrl, config)
    return request.data
  }catch (error){
    console.error('Error fetching blogs (get ALL):', error.response ? error.response.data : error)  // 添加错误处理
    throw error 
  }
}


const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, setToken, create }