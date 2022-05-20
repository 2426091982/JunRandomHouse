<template>
  <!-- 滚动条包裹 -->

  <!-- 使用动态过渡名称 -->
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transitionName">
      <!-- 除了指定组件不缓存 -->
      <keep-alive exclude="detail">
        <component :is="Component" />
      </keep-alive>
    </transition>
    <div id="nav" v-show="route.meta.showNav">
      <router-link class="link " to="/home">
        <van-icon name="wap-home-o" size="20" />
        <div>首页</div>
      </router-link>
      <router-link class="link" to="/category">
        <van-icon name="apps-o" size="20" />
        <div>分类</div>
      </router-link>
      <router-link class="link" to="/shopCart">
        <van-badge
          v-show="$store.state.cartCount !== 0"
          :content="$store.state.cartCount"
          max="9"
          color="#f88358"
        >
          <van-icon name="cart-o" size="20" />
        </van-badge>
        <van-icon
          v-show="$store.state.cartCount === 0"
          name="cart-o"
          size="20"
        />
        <div>购物车</div>
      </router-link>
      <router-link class="link" to="/profile"
        ><van-icon name="user-o" size="20" />
        <div>我的</div>
      </router-link>
    </div>
  </router-view>
</template>

<script lang="ts" scope>
// 路由
import { useRouter } from "vue-router";
import { ref, watch, getCurrentInstance, onMounted } from "vue";
import { useStore } from "vuex";
// 获取购物车数据
import { getCartList } from "./network/shopCart";
export default {
  setup(props: any, content: any) {
    const { ctx }: any = getCurrentInstance();
    const router = useRouter();
    // vuex
    const store = useStore();
    // 获取路由路径
    let fullPath = window.location.pathname;

    // 路由守卫
    router.afterEach((to, from) => {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      to.meta.transitionName =
        toDepth < fromDepth ? "van-slide-right" : "van-slide-left";
    });

    onMounted(() => {
      // 分发事件，获取最新购物车数量
      store.dispatch("updateCartCount");
    });

    // console.log(ctx.$router.currentRoute);
    return {
      fullPath,
    };
  },
};
</script>

<style lang="less">
@import "~assets/css/base.css";
#nav {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  display: flex;
  padding: 20px 0;
  border-radius: 15px;
  box-shadow: 2px 2px 20px 2px rgba(0, 0, 0, 0.3);

  .link {
    flex: 1;
    text-align: center;
  }
}
// 路由跳转样式
.router-link-active {
  color: #fa784a;
}
</style>
