<template>
  <div v-show="recomends" class="recommendView">
    <!-- 标题 -->

    <div v-show="title" class="title">
      <div class="text flexCenter">{{ title }}</div>
      <div class="more flexCenter">
        <!-- 更多图标 -->
        <van-icon name="ellipsis" />
      </div>
    </div>
    <!-- 推荐内容 -->
    <!-- 切除框 -->
    <Scroll @scrollToEndX="scrollToEnd">
      <!-- 视觉框 -->
      <ul class="content">
        <!-- 推荐书籍 -->
        <li
          class="contentItem"
          v-for="item in recomends.slice(0, 5)"
          :key="item.id"
          @click.native="goDetail(item.id)"
        >
          <!-- <img v-lazy="item.cover_url" /> -->
          <van-image lazy-load width="150" height="150" :src="item.cover_url">
            <!-- 加载中 -->
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <!-- 加载失败提示 -->
            <template v-slot:error>图片加载失败</template>
          </van-image>
          <!-- 描述 -->
          <p class="description ellipsis">{{ item.description }}</p>
          <!-- 标题 -->
          <h4 class="bookName ellipsis">
            {{ item.title }}
          </h4>
        </li>
      </ul>
    </Scroll>
  </div>
</template>

<script lang="ts">
// 导入滚动组件
import Scroll from "components/common/scroll/Scroll.vue";
// 导入路由
import { useRouter } from "vue-router";
// 导入计算属性
import { computed } from "vue";
export default {
  name: "RecommendView",
  props: {
    // 推荐列表
    recomends: Array,
    // 标题
    title: String,
  },
  setup(props: any, { emit }: any) {
    // 路由
    const router = useRouter();
    // 跳转详情
    const goDetail = (id: number) => {
      // 跳转到详情,传参数
      router.push({
        path: "/detail",
        query: { id },
      });
    };
    // 接收下拉事件
    const scrollToEnd = () => {
      // 发送下拉事件
      emit("scrollToEnd");

      
    };
    return {
      goDetail,
      scrollToEnd,
    };
  },
  components: {
    Scroll,
  },
};
</script>

<style lang="less" scoped>
.recommendView {
  background-color: #fff;
  padding-bottom: 15px;
  border-radius: 20px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text {
      padding: 15px;
      font-weight: 700;
    }
    .more {
      padding: 15px;
    }
  }
  .content {
    padding: 0 15px;
    height: 200px;
    width: 780px;
    .contentItem {
      float: left;
      width: 150px;
      img {
        width: 100%;
        height: 100%;
      }
      .description {
        color: #999;
        text-align: center;
        margin-bottom: 10px;
      }

      .bookName {
        text-align: center;
        color: #767676;
      }
    }
  }
}
</style>
