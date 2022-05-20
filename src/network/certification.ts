import request from "./request";

// 注册账号
export const register = (options: any) => {
  return request({
    url: "/api/auth/register",
    method: "post",
    ...options,
  });
};
// 登录账号
export const login = (options: any) => {
  return request({
    url: "/api/auth/login",
    method: "post",
    ...options,
  });
};
