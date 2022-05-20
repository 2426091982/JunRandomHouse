import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import store from "../store";
import { Toast } from "vant";
console.log(store);

// 主页
const Home = () => import("views/home/Home.vue");
// 分类页面
const Category = () => import("views/category/Category.vue");
// 商品详情页面
const Detail = () => import("views/detail/Detail.vue");
// 个人中心
const Profile = () => import("views/profile/Profile.vue");
// 购物车
const ShopCart = () => import("views/shopCart/ShopCart.vue");
// 登录
const Login = () => import("views/certification/Login.vue");
// 注册
const Register = () => import("views/certification/Register.vue");
// 地址管理
const AddressList = () => import("views/profile/address/AddressList.vue");
// 修改地址
const AddressEdit = () => import("views/profile/address/AddressEdit.vue");
// 提交订单
const CreateOrder = () => import("views/shopCart/CreateOrder.vue");
// 账号管理
const Setting = () => import("views/profile/Setting.vue");
// 订单详情
const OrderDetail = () => import("views/shopCart/OrderDetail.vue");
// 订单列表
const OrderList = () => import("views/shopCart/OrderList.vue");
// 我的收藏
const MyCollect = () => import("views/profile/MyCollect.vue");

const routes: Array<RouteRecordRaw> = [
  /* 首页 */
  {
    path: "/",
    name: "DefaultHome",
    redirect: "/home",
  },
  /* 首页 */
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      title: "EwShop-首页",
      // 展示tabBar
      showNav: true,
    },
  },
  /* 分类页面 */
  {
    path: "/category",
    name: "Category",
    component: Category,
    meta: {
      title: "EwShop-分类",
      // 展示tabBar
      showNav: true,
    },
  },
  /* 商品详情页面 */
  {
    path: "/detail",
    name: "Detail",
    component: Detail,
    meta: {
      title: "EwShop-商品详情",
    },
  },
  /* 个人中心 */
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: "EwShop-个人中心",
      // 展示tabBar
      showNav: true,
      // 是否要token
      isAuthRequired: true,
    },
  },
  /* 购物车 */
  {
    path: "/shopCart",
    name: "ShopCart",
    component: ShopCart,
    meta: {
      title: "EwShop-购物车",
      // 展示tabBar
      showNav: true,
      // 是否要token
      isAuthRequired: true,
    },
  },
  /* 登录 */
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "EwShop-用户登录",
    },
  },
  /* 注册 */
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "EwShop-用户注册",
    },
  },
  /* 地址管理 */
  {
    path: "/addressList",
    name: "AddressList",
    component: AddressList,
    meta: {
      title: "地址管理",
      // 是否要token
      isAuthRequired: true,
    },
  },
  /* 地址修改 */
  {
    path: "/addressEdit",
    name: "AddressEdit",
    component: AddressEdit,
    meta: {
      title: "修改地址",
      // 是否要token
      isAuthRequired: true,
    },
  },
  /* 提交订单 */
  {
    path: "/createOrder",
    name: "CreateOrder",
    component: CreateOrder,
    meta: {
      title: "修改地址",
      // 是否要token
      isAuthRequired: true,
    },
  },
  /* 账号管理 */
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
    meta: {
      title: "账号设置",
      // 是否要token
      isAuthRequired: true,
    },
  },
  /* 订单详情 */
  {
    path: "/orderDetail",
    name: "OrderDetail",
    component: OrderDetail,
    meta: {
      title: "订单详情",
      // 是否要token
      isAuthRequired: true,
    },
  },
  /* 订单列表 */
  {
    path: "/orderList",
    name: "OrderList",
    component: OrderList,
    meta: {
      title: "订单列表",
      // 是否要token
      isAuthRequired: true,
    },
  },
  /* 收藏列表 */
  {
    path: "/collect",
    name: "MyCollect",
    component: MyCollect,
    meta: {
      title: "我的收藏",
      // 是否要token
      isAuthRequired: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // 如果没有登录，在这里跳转到Login
  if (to.meta.isAuthRequired && store.state.user.isLogin === false) {
    Toast("你还没有登录，请先登录");
    return next("/login");
  } else {
    next();
  }
  //修改标题
  (document as any).title = to.meta.title;
});
export default router;
