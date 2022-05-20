<template>
  <div @click="backTop" class="backTop flexCenter">
    <!-- 返回顶部图标 -->
    <van-icon class="backTopIcon" color="#ff7e54" size="30" name="back-top" />
  </div>
</template>

<script lang="ts">
export default {
  name: "backTop",
  setup(props: any, { emit }: any) {
    // 返回顶部方法
    const backTop = () => {
      
      // 发送返回顶部事件
      emit("backTop");
    };
    return {
      backTop,
    };
  },
};
</script>

<style lang="less" scoped>
.backTop {
  position: fixed;
  bottom: 145px;
  right: 5px;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 5px 5px 10px #888;
}
</style>
