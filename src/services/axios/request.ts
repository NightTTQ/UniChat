import axios from "axios";

// axios实例
const instance = axios.create({
  baseURL: "/api",
  timeout: 300000,
  headers: {},
});

// 请求拦截器
instance.interceptors.request.use(
  (req) => {
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
