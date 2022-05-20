import request from "./request";

// 添加地址
export const addAddress = (params: any) => {
  return request({
    url: "/api/address",
    method: "POST",
    params,
  });
};
// 获取地址列表
export const getAddressList = () => {
  return request({
    url: "/api/address",
    method: "GET",
  });
};

// 获取地址详情
export const getAddressDetail = (addressId: any) => {
  return request({
    url: `/api/address/${addressId}`,
    method: "GET",
  });
};

// 更新地址详情
export const updateAddress = (addressId: any,params:any) => {
  return request({
    url: `/api/address/${addressId}`,
    method: "PUT",
    params
  });
};

// 删除地址
export const deleteAddress = (addressId: any) => {
  return request({
    url: `/api/address/${addressId}`,
    method: "DELETE",
  });
};

// 设为默认地址
export const setDefaultAddress = (addressId: any) => {
  return request({
    url: `/api/address/${addressId}/default`,
    method: "PATCH",
  });
};
