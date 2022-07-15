/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from "axios";
import { BACK_END_URL } from "@/config";
import { useStatusStore } from "@/stores/status";
import router from "@/router";

const request = axios.create({
  baseURL: BACK_END_URL,
  timeout: 5000,
});

// request 拦截器
request.interceptors.request.use(
  (config) => {
    const status = useStatusStore();
    const route = router.currentRoute.value.name;
    if (route !== "login" && status.logged === false) {
      router.push("/login");
    }
    config.headers!["Content-Type"] = "application/json;charset=utf-8";
    const jwt = status.token;
    if (jwt) {
      config.headers!["Authorization"] = jwt; // 设置jwt
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response 拦截器
request.interceptors.response.use(
  (response) => {
    const status = useStatusStore();
    if (response.config.responseType === "blob") {
      return response;
    }
    let data = response.data;
    if (typeof data === "string") {
      data = data ? JSON.parse(data) : data;
      response.data = data;
    }
    console.log(response);
    if (response.data.code === 401) {
      window.$message.error("登录已过期，请重新登录");
      status.setLoggingStatus(false);
      router.push("/login");
      return Promise.reject(response);
    }
    return response;
  },
  (error) => {
    window.$message.error("网络异常，请稍后再试");
    return Promise.reject(error);
  }
);

export default request;
