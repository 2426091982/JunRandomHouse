export default {
  // 改变登录状态
  setIsLogin(state: any, payload: boolean) {
    state.user.isLogin = payload;
  },
  // 改变购物车显示数量
  setCartCount(state: any, payload: any) {
    state.cartCount = payload.cartCount;
  },
};
