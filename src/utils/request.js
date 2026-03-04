// src/utils/request.js
import axios from 'axios';
import { showToast } from 'vant';
import { useUserStore } from '../store/user';

// 创建axios实例
const request = axios.create({
  // Vite 中使用 import.meta.env 而不是 process.env
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    // 添加token
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data;

    // 如果使用了mockData，直接返回
    if (response.config && response.config.mockData) {
      return response.config.mockData;
    }

    // 根据自定义code判断请求状态
    if (res.code !== 200) {
      showToast(res.msg || '请求失败');
      return Promise.reject(new Error(res.msg || '请求失败'));
    }
    return res;
  },
  error => {
    console.error('请求错误:', error);
    showToast('网络错误，请稍后重试');
    return Promise.reject(error);
  }
);

// 封装请求方法
export default {
  get(url, params, config = {}) {
    return request({
      method: 'get',
      url,
      params,
      ...config
    });
  },

  post(url, data, config = {}) {
    return request({
      method: 'post',
      url,
      data,
      ...config
    });
  },

  put(url, data, config = {}) {
    return request({
      method: 'put',
      url,
      data,
      ...config
    });
  },

  delete(url, params, config = {}) {
    return request({
      method: 'delete',
      url,
      params,
      ...config
    });
  }
};