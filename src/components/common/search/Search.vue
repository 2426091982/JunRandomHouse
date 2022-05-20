<template>
  <div class="search">
    <div class="leftIcon flexCenter" @click="leftIconClick">
      <slot name="leftIcon"></slot>
    </div>
    <input type="text" placeholder="search" v-model="searchValue" />
    <div class="rightIcon flexCenter " @click="rightIconClick">
      <slot name="rightIcon"></slot>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "",
  setup(props, { emit }) {
    // 搜索框的值
    let searchValue = ref("");
    // 左边按钮点击事件
    const leftIconClick = () => {
      emit("leftClick", searchValue.value);
    };
    // 右边边按钮点击事件
    const rightIconClick = () => {
      emit("rightClick", searchValue.value);
    };
    return {
      searchValue,
      leftIconClick,
      rightIconClick,
    };
  },
};
</script>

<style lang="less" scoped>
.search {
  display: flex;
  margin: 0 15px;
  border-radius: 10px;
  background-color: #f3f3f4;
  height: 40px;
  .leftIcon {
    min-width: 40px;
    slot {
    }
  }

  input {
    flex: 1;
    padding: 7px;
    border: none;
    outline: none;
    background-color: #f3f3f4;
  }

  .rightIcon {
    min-width: 40px;

    slot {
    }
  }
}
</style>
