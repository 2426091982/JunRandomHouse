import request from "./request";

// 用户详情
export const getUserInfo = () => {
  return request({
    url: "/api/user",
    method: "GET",
  });
};
// 更新用户详情名字
export const updateUserInfo = (name: string) => {
  return request({
    url: "/api/user",
    method: "PUT",
    params: {
      name,
    },
  });
};
// 用户详情
export const updateAvatar = (avatar: string) => {
  return request({
    url: "/api/user/avatar",
    method: "PATCH",
    params: {
      avatar,
    },
  });
};
