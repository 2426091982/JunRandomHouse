import request from "./request";

// 获取购物车列表
export const getCartList = (data: string = '') => {
  return request({
    url: "/api/carts?" + data,
  });
};

// 改变购物车数量 cartId number
export const modifyCart = (cartId: any, num: number) => {
  return request({
    url: `/api/carts/${cartId}`,
    method: "put",
    params: {
      num,
    },
  });
};

// 移除购物车商品  cartId
export const deleteCartItem = (cartId: any) => {
  return request({
    url: `/api/carts/${cartId}`,
    method: "delete",
  });
};

// 购物车改变选中状态 cart_ids: 所有选中的id
export const changeCheckCart = (cart_ids: any) => {
  return request({
    url: "/api/carts/checked",
    method: "patch",
    params: {
      cart_ids,
    },
  });
};
