// AxiosInstance.js
import axios from 'axios';

const AxiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/' : '' ,  
    withCredentials: true,
});

export default AxiosInstance;