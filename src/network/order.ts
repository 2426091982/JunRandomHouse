import request from "./request";

// 订单预览
export const createOrder = (params: any = {}) => {
  return request({
    url: "/api/orders/preview",
    method: "GET",
    params,
  });
};

// 提交订单
export const submitOrder = (address_id: number) => {
  return request({
    url: "/api/orders",
    method: "POST",
    params: {
      address_id,
    },
  });
};

// 订单详情
export const detailOrder = (order: any) => {
  return request({
    url: `/api/orders/${order}`,
    method: "GET",
    params: {
      include:"goods,orderDetails.goods"
    },
  });
};

// 订单列表
export const orderList = (Info: any = {}) => {
  return request({
    url: "/api/orders",
    method: "GET",
    params: {
      ...Info,
      include: "goods,orderDetails.goods"
    },
  });
};

// 物流详情
export const logisticsDetail = (order: number) => {
  return request({
    url: `/api/orders/${order}/express`,
    method: "GET",
  });
};
// 确认收货
export const confirmOrder = (order: number) => {
  return request({
    url: `/api/orders/${order}/confirm`,
    method: "PATCH",
  });
};
// 评价商品
export const evaluationOrder = (order: number) => {
  return request({
    url: `/api/orders/${order}/comment`,
    method: "POST",
  });
};
// 获取支付二维码
export const payOrder = (orderId: number, params: any) => {
  return request({
    url: `/api/orders/${orderId}/pay`,
    params,
  });
};
// 查询订单状态
export const payOrderStatus = (orderId: number) => {
  return request({
    url: `/api/orders/${orderId}/status`,
  });
};
