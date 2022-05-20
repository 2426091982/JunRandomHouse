import request from "./request";

// 获取分类页所有数据
export const getCategory = (options: any = {}) => {
  return request({
    url: "/api/goods",
    ...options,
  });
};

// 获取分类商品数据
export function getCategoryGoods(
  order: string = "sales",
  cid: number = 2,
  page: number = 1
) {
  return request({
    url: "/api/goods",
    params: {
      // 分类id
      category_id: cid,
      // 页数
      page: page,
      // 排序方式
      [order]: 1,
    },
  });
}
