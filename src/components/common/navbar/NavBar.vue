<template>
  <div class="navbar">
    <div @click="goback" class="left flexCenter">
      <slot name="left"></slot>
    </div>
    <div class="center flexCenter">
      <slot name="center"></slot>
    </div>
    <div class="right flexCenter">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
// 导入路由
import { useRouter } from "vue-router";
export default {
  name: "NavBar",
  setup() {
    const router = useRouter();
    // 返回上一页
    const goback = () => {
      router.go(-1);
    };
    return { goback };
  },
};
</script>

<style lang="less" scoped>
.navbar {
  background-color: #fff;
  padding: 20px 0;
  display: flex;
  color: var(--color-text);
  .left {
    width: 60px;
  }
  .center {
    flex: 1;
  }
  .right {
    width: 60px;
  }
}

</style>
