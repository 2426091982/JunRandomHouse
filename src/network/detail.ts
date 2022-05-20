import request from "./request";

// 获取商品详情数据
export const getDetail = (id: any = 1) => {
  return request({
    url: "/api/goods/" + id,
  });
};

// 添加购物车
export const addCart = (goods_id: any, num: number = 1) => {
  return request({
    url: "/api/carts",
    method: "post",
    params: {
      // 商品id
      goods_id,
      // 数量
      num
    }
  });
};
