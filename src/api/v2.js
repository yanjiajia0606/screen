/*
 * @Author: 闫佳佳 18332162809@163.com
 * @Date: 2022-10-31 10:43:50
 * @LastEditors: 闫佳佳 18332162809@163.com
 * @LastEditTime: 2022-11-15 14:13:01
 * @FilePath: /avue-data/src/api/v2.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "../axios";
export const getApiGroup = () => {
  return request({
    url: "/sr/swagger-resources",
    method: "get",
  });
};
export const getApiScource = (group) => {
  return request({
    url: "/sr/v2/api-docs",
    method: "get",
    params: {
      group,
    },
  });
};
