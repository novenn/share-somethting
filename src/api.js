import axios from 'axios';

// export const SERVER =  "http://localhost:9527/"
export const SERVER =  ""
export const PORT   = 9527

// 设置基本的请求配置，例如API根URL和请求超时时间
const api = axios.create({
  baseURL:  SERVER,
  timeout: 5000,
});

// 封装GET请求
export const get = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 封装POST请求
export const post = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 封装文件上传请求
export const uploadFile = async (url, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(url, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};