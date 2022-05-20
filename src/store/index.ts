import { createStore } from "vuex";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

// 判断是否有token
const isLogin = localStorage.getItem("token") ? true : false;

// 状态
const state = {
  //用户状态
  user: {
    isLogin,
  },
  // 购物车数量
  cartCount: 0,
};

export default createStore({
  state,
  mutations,
  actions,
  getters,
});
