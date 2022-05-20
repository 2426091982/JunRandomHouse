import request from "./request";

// 我的收藏
export const myCollects = (page: number) => {
  return request({
    url: "/api/collects",
    method: "GET",
    query: {
      page,
    },
  });
};

// 收藏和取消收藏
export const collects = (goodId: number) => {
  return request({
    url: `/api/collects/goods/${goodId}`,
    method: "POST",
  });
};
