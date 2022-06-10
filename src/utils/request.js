import axios from "axios";
import { getToken, hasToken, removeToken } from "./storage";
import history from "./history";

export const baseURL = 'http://geek.itheima.net/v1_0'

const instance = axios.create({
  baseURL,
  timeout: 500
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (hasToken()) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response.status === 401) {
    removeToken()
    history.push('/login')
  }
  return Promise.reject(error);
});

export default instance