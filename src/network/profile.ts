import request from "./request";

// 退出登录
export const loginOut = () => {
  return request({
    url: "/api/auth/logout",
    method: "POST",
  });
};

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: "/api/user",
    method: "GET",
  });
};

// 修改用户信息
export const modifyUserInfo = (name: string) => {
  return request({
    url: "/api/user",
    method: "PUT",
    params: {
      name,
    },
  });
};
// 更新用户头像
export const modifyUserAvatar = (avatar: string) => {
  return request({
    url: "/api/user/avatar",
    method: "PATCH",
    params: {
      avatar,
    },
  });
};
