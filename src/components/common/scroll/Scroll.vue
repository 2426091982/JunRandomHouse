<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts" scope>
import BScroll from "better-scroll";
import { getCurrentInstance, onMounted, watch } from "vue";
export default {
  name: "RecommendView",
  props: {},
  // 发送的事件
  emits: ["scrollToEnd", "scroll", "isBackTopOver", "scrollToEndX","scrollToEndY"],
  setup(props: any, { emit }: any) {
    // 获取上下文
    const { ctx }: any = getCurrentInstance();
    // 配置滚动条
    const options = {
      scrollY: true, // 因为scrollY默认为true，其实可以省略
      scrollX: true, // 因为scrollX默认为true，其实可以省略
      click: true, // 可以点击
      probeType: 3,
    };
    onMounted(() => {
      // 挂载
      setTimeout(() => {
        // 初始化滚动条
        ctx.scroll = new BScroll(ctx.$refs.wrapper, options);
        // 监听下拉到底部
        ctx.scroll.on("scrollEnd", () => {
          // 滚动到底部
          if (ctx.scroll.x <= ctx.scroll.maxScrollX + 100) {

            // 发送事件
            emit("scrollToEndX");
          }
          // 滚动到底部
          if (ctx.scroll.y <= ctx.scroll.maxScrollY + 100) {
            // 发送事件
            emit("scrollToEndY");
          }
        });

        // 监听滚动事件
        ctx.scroll.on("scroll", (pos: any) => {
          // 发送事件
          emit("scroll", pos);
        });
      }, 20);
    });

    //返回顶部
    const backTop = () => {
      // 返回顶部
      ctx.scroll.scrollTo(0, 0, 500);
    };

    // 重新计算高度
    const refresh = () => {
      setTimeout(() => {
        // 重新计算高度
        ctx.scroll.refresh();
      }, 20);
    };

    return { refresh, backTop };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  overflow: hidden;
  height: 100%;
}
</style>
