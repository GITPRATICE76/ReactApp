import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.41:8085/api",
});

// 🔐 Attach JWT automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
