/*
 * @Author: 闫佳佳 18332162809@163.com
 * @Date: 2022-06-08 15:15:30
 * @LastEditors: 闫佳佳 18332162809@163.com
 * @LastEditTime: 2022-12-16 18:12:08
 * @FilePath: /avue-data/src/axios.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import { Loading } from 'element-ui';
import { validatenull } from "@/echart/util";
import { checkUrl, getFunction } from "@/utils/utils";
import axios from "axios";
window.$glob = {
  url: "",
  params: {},
  query: {},
  headers: {
    "Blade-Auth": 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJ1c2VyX25hbWUiOiJhZG1pbmlzdHJhdG9yQDZjbG91ZCIsInJlYWxfbmFtZSI6Iui2hee6p-euoeeQhuWRmCIsImF2YXRhciI6IiIsImF1dGhvcml0aWVzIjpbImFkbWluaXN0cmF0b3IiXSwiY2xpZW50X2lkIjoic2FiZXIiLCJyb2xlX25hbWUiOiJhZG1pbmlzdHJhdG9yIiwibGljZW5zZSI6InBvd2VyZWQgYnkgYmxhZGV4IiwicG9zdF9pZCI6IjEzNTc1OTQzMjI0MDk3NDIzMzciLCJwZCI6IntibGFkZX1lMzQ3MWUwMjcxOWYzMWJkODNkZmQ3NmY5OWI5MGNlYmYzNDQzMWIwIiwidXNlcl9pZCI6IjEzNTMyNjMyMTc3NzM2NzQ0OTgiLCJyb2xlX2lkIjoiMTEyMzU5ODgxNjczODY3NTIwMSIsInNjb3BlIjpbImFsbCJdLCJuaWNrX25hbWUiOiLotoXnuqfnrqHnkIblkZgiLCJpc0NoYW5nZVB3ZCI6InJlc2V0Iiwib2F1dGhfaWQiOiIiLCJkZXRhaWwiOnsidHlwZSI6IndlYiJ9LCJleHAiOjE2NzEyNDE2ODYsImRlcHRfaWQiOiIxMzU3NTkwNjYwMDc4MTk4Nzg2IiwianRpIjoiMjQyNmYxN2MtMWZhYS00NzdhLWJlNWMtMjdjYzUwODgzNjNmIiwiYWNjb3VudCI6ImFkbWluaXN0cmF0b3JANmNsb3VkIn0.0tAeIp4__lDJQ6CYDQRjYNy5WlXKuiYkipZ1_HyfnpU'
  },
};
function getGlobParams() {
  var query = window.location.search.substring(1);
  query = query.split("&");
  query.forEach((ele) => {
    var pair = ele.split("=");
    window.$glob.params[pair[0]] = pair[1];
  });
}

axios.defaults.timeout = 10000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
// let loadingInstance = '';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  (config) => {
    // loadingInstance = Loading.service({
    //   text: '拼命加载中',
    //   background: 'rgba(0,0,0,0)',
    //   spinner: 'el-icon-loading'
    // });
    getGlobParams();
    if (!checkUrl(config.url)) {
      config.url = window.$glob.url + config.url;
    }
    if (!validatenull(window.$glob.header)) {
      let header = getFunction(window.$glob.header)();
      config.headers = Object.assign(config.headers, header);
    }
    config.headers = {
      "Blade-Auth": 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJ1c2VyX25hbWUiOiJhZG1pbmlzdHJhdG9yQDZjbG91ZCIsInJlYWxfbmFtZSI6Iui2hee6p-euoeeQhuWRmCIsImF2YXRhciI6IiIsImF1dGhvcml0aWVzIjpbImFkbWluaXN0cmF0b3IiXSwiY2xpZW50X2lkIjoic2FiZXIiLCJyb2xlX25hbWUiOiJhZG1pbmlzdHJhdG9yIiwibGljZW5zZSI6InBvd2VyZWQgYnkgYmxhZGV4IiwicG9zdF9pZCI6IjEzNTc1OTQzMjI0MDk3NDIzMzciLCJwZCI6IntibGFkZX1lMzQ3MWUwMjcxOWYzMWJkODNkZmQ3NmY5OWI5MGNlYmYzNDQzMWIwIiwidXNlcl9pZCI6IjEzNTMyNjMyMTc3NzM2NzQ0OTgiLCJyb2xlX2lkIjoiMTEyMzU5ODgxNjczODY3NTIwMSIsInNjb3BlIjpbImFsbCJdLCJuaWNrX25hbWUiOiLotoXnuqfnrqHnkIblkZgiLCJpc0NoYW5nZVB3ZCI6InJlc2V0Iiwib2F1dGhfaWQiOiIiLCJkZXRhaWwiOnsidHlwZSI6IndlYiJ9LCJleHAiOjE2NzEyNDE2ODYsImRlcHRfaWQiOiIxMzU3NTkwNjYwMDc4MTk4Nzg2IiwianRpIjoiMjQyNmYxN2MtMWZhYS00NzdhLWJlNWMtMjdjYzUwODgzNjNmIiwiYWNjb3VudCI6ImFkbWluaXN0cmF0b3JANmNsb3VkIn0.0tAeIp4__lDJQ6CYDQRjYNy5WlXKuiYkipZ1_HyfnpU'

    }
    //获取全局参数
    if (typeof config.data === "object" && !validatenull(window.$glob.query)) {
      let query = getFunction(window.$glob.query)();
      let data = Object.assign(window.$glob.params, query);
      if (config.method == "get") {
        config.params = Object.assign(config.params, data);
      } else if (config.method == "post") {
        config.data = Object.assign(config.data, data);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//HTTPrequest拦截
axios.interceptors.response.use(
  (config) => {
    // loadingInstance.close();
    return config;
  },
  (error) => {
    // loadingInstance.close();
    return Promise.reject(new Error(error));
  }
);

export default axios;
