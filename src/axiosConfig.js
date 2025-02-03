import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://liminal-server.onrender.com', 
});

export default axiosInstance;
