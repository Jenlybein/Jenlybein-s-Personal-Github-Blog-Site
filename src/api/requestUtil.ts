import axios from "axios";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { ElMessage } from "element-plus";



const service = axios.create({
  timeout: 50000,
});

/**
 * 添加请求拦截器
 * @param config - 请求配置对象
 * @returns config - 修改后的请求配置对象
 */
service.interceptors.request.use((config) => {
  NProgress.start();

  return config;
});

/**
 * 添加响应拦截器
 * @param response - 响应对象
 * @returns 响应数据中的data属性数据或拒绝请求
 */
service.interceptors.response.use(
  (response) => {
    NProgress.done();

    if (response.data.code !== 200 
      && response.config.responseType !== 'arraybuffer') {
      ElMessage("请求状态码：" + response.data.code);
    }

    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(ElMessage.error(error.response.data.message));
  }
);

export default service;
