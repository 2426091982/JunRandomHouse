import request from "./request";

// 获取首页所有数据
export const getHomeAllData = (options: any = {}) => {
  return request({
    url: "/api/index",
    ...options,
  });
};

// 获取首页所有数据
export const getHomeGoods = (options: any = {}) => {
  return request({
    url: "/api/index",
    ...options,
  });
};
