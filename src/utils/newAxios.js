// 封装的Axios
import axios from 'axios';

const newAxios = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

newAxios.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*';
  // 可以在这里添加其他的请求头设置
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default newAxios;
