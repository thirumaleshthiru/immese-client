import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"https://immsense-server-production.up.railway.app/"
});

export default axiosInstance