// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'https://liminal-server.onrender.com', 
// });

// export default axiosInstance;
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'  // or whatever your local URL is
    : 'https://liminal-server.onrender.com', 
});

export default axiosInstance;
