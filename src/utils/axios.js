// axios拦截器，主要是用于为后续请求添加token

import axios from 'axios';

const instance = axios.create({
  timeout: 5000, // 请求超时时间
  withCredentials: true
});
// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 从本地存储中获取 token
    if (token) {
      
      config.headers.Authorization = `${token}`; // 将 token 添加到请求头中
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
