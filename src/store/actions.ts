// 获取商品列表
import { getCartList } from "../network/shopCart";

export default {
  // 更新购物车的数量
  updateCartCount(context: any) {
    // 获取商品列表
    getCartList().then((res) => {
      // 调用mutations 的方法
      context.commit("setCartCount", { cartCount: res.data.length || 0 });
    });
  },
};
