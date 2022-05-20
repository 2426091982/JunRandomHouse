<template>
  <div class="box">
    <!-- navbar组件 -->
    <nav-bar class="fixedNav">
      <template v-slot:left>
        <!-- 图标 -->
        <van-icon name="apps-o" size="25" />
      </template>
      <template v-slot:center>
        <div class="title">嘉俊书屋</div>
      </template>
      <template v-slot:right>
        <!-- 图标 -->
        <van-badge :offset="[-5, 5]" :content="5" color="#ff7e54">
          <div class="portrait">
            <van-image
              lazy-load
              round
              src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_70%2Cc_zoom%2Cw_640%2Fimages%2F20181003%2F05950ae967984520b83a0bd9ea20f40c.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619142694&t=cad743b1ace814b9d0700af96c31a8a0"
            />
          </div>
        </van-badge>
      </template>
    </nav-bar>
    <!-- 滚动条 -->
    <Scroll ref="homeScroll" @scroll="scrollShow">
      <div class="content">
        <!-- 搜索框 -->
        <Search @rightClick="searchRightClick">
          <!-- 左图标 -->
          <template #leftIcon>
            <van-icon name="setting-o" size="20" />
          </template>
          <template #rightIcon>
            <van-icon name="search" size="20" />
          </template>
        </Search>

        <!-- banner轮播图 -->

        <div class="banner">
          <van-swipe
            class="my-swipe"
            :autoplay="3000"
            indicator-color="white"
            lazy-render
          >
            <van-swipe-item>
              <van-image
                width="100%"
                height="167px"
                fit="cover"
                src="http://img61.ddimg.cn/tingshu/1015/dasong.jpg"
              />
            </van-swipe-item>
            <van-swipe-item>
              <van-image
                width="100%"
                height="167px"
                fit="cover"
                src="http://img63.ddimg.cn/cuxiao/ciwusd670-332.jpg"
              />
            </van-swipe-item>
            <van-swipe-item>
              <van-image
                width="100%"
                height="167px"
                fit="cover"
                src="http://img62.ddimg.cn/ddreader/dangebook/dhynew670x332.jpg"
              />
            </van-swipe-item>

            <van-swipe-item>
              <van-image
                width="100%"
                height="167px"
                fit="cover"
                src="http://img62.ddimg.cn/vip01/jxJDTxxjd.jpg"
              />
            </van-swipe-item>
            <van-swipe-item>
              <van-image
                width="100%"
                height="167px"
                fit="cover"
                src="http://img61.ddimg.cn/cuxiao/renmsx332.jpg"
              />
            </van-swipe-item>
          </van-swipe>
        </div>

        <!-- 我的书架 -->
        <RecommendView
          :recomends="recomends"
          title="My library"
        ></RecommendView>

        <!-- tab组件 -->
        <van-tabs
          color="#ff7e54"
          line-width="70"
          title-active-color="#ff7e54"
          v-model:active="activeName"
        >
          <van-tab
            title="bestSelling"
            name="BestSelling"
            title-style="fontWeight:700"
          >
            <RecommendView
              @scrollToEnd="scrollToEnd('sales')"
              :recomends="goods.sales.list"
            ></RecommendView>
          </van-tab>
          <van-tab title="NewBook" name="NewBook" title-style="fontWeight:700">
            <RecommendView
              @scrollToEnd="scrollToEnd('recomend')"
              :recomends="goods.recommend.list"
            ></RecommendView>
          </van-tab>
          <van-tab title="Select" name="Select" title-style="fontWeight:700">
            <RecommendView
              @scrollToEnd="scrollToEnd('new')"
              :recomends="goods.new.list"
            ></RecommendView>
          </van-tab>
        </van-tabs>

        <!-- 推荐组件 -->
        <RecommendView :recomends="recomends" title="For You"></RecommendView>

        <!-- 阅读进度组件 -->
        <RecentlyRead />
      </div>
    </Scroll>

    <!-- 过渡组件 -->
    <transition name="van-slide-right">
      <!-- 返回顶部组件 -->
      <BackTop @backTop="changeIsBackTop(true)" v-show="isBackTopFixed" />
    </transition>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed, reactive, getCurrentInstance } from "vue";
// 获取所有数据
import { getHomeAllData, getHomeGoods } from "@/network/home";

/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
// /* 导入RecommendView 推荐组件 */
import RecommendView from "components/common/recommendView/RecommendView.vue";
// /* 导入返回顶部组件 */
import BackTop from "components/common/backTop/BackTop.vue";
// 导入最近阅读组件
import RecentlyRead from "./ChildComps/RecentlyRead.vue";
// 导入滚动组件
import Scroll from "components/common/scroll/Scroll.vue";
// 导入搜索框
import Search from "components/common/search/Search.vue";
// 导入vant提示组件
import { Toast } from "vant";

export default {
  name: "home",
  setup() {
    // 获取ctx
    const { ctx }: any = getCurrentInstance();
    // recomends推荐数据
    let recomends = ref([]);
    // banner 轮播图书籍
    let slides = ref([]);
    // categories 分类书籍
    let categories = ref([]);
    // 商品数据
    let goods = reactive({
      // 热销商品
      sales: {
        page: 1,
        list: [],
      },
      // 推荐商品
      recommend: {
        page: 1,
        list: [],
      },
      // 最新商品
      new: {
        page: 1,
        list: [],
      },
    });
    // tab选中的标签
    const activeName = ref("bestSelling");
    // 是否显示返回顶部按钮
    const isBackTopFixed = ref(false);
    // 挂载执行
    onMounted(() => {
      // 请求home页面的所有数据
      getHomeAllData().then((res: any) => {
        // 赋值recomends推荐数据
        recomends.value = res.goods.data;
        // 赋值banner 轮播图书籍
        slides.value = res.slides;
        // 赋值分类书籍
        categories.value = res.categories;
        // 打乱数组
        recomends.value.sort(() => 0.5 - Math.random());
      });

      // 请求热销商品数据
      getHomeGoods({
        params: {
          sales: 1,
          page: goods.sales.page,
        },
      }).then((res: any) => {
        // 赋值数据
        goods.sales.list = res.goods.data;
      });
      //  请求推荐商品数据
      getHomeGoods({
        params: {
          recommend: 1,
          page: goods.recommend.page,
        },
      }).then((res: any) => {
        // 赋值数据
        goods.recommend.list = res.goods.data;
      });
      //  请求最新商品数据
      getHomeGoods({
        params: {
          new: 1,
          page: goods.new.page,
        },
      }).then((res: any) => {
        // 赋值数据
        goods.new.list = res.goods.data;
      });
    });

    // 搜索书籍
    const searchRightClick = (searchValue: string) => {
      console.log("该功能开发中...", searchValue);
    };

    // 下拉刷新数据
    const scrollToEnd = (type: string) => {
      if (type === "sales") {
        // 请求热销商品数据
        getHomeGoods({
          params: {
            sales: 1,
            page: goods.sales.page++,
          },
        }).then((res: any) => {
          // 赋值数据
          goods.sales.list = res.goods.data;
          // 成功提示
          ctx.$toast("加载成功");
        });
      } else if (type === "recomend") {
        // 请求热销商品数据
        getHomeGoods({
          params: {
            recommend: 1,
            page: goods.recommend.page++,
          },
        }).then((res: any) => {
          // 赋值数据
          goods.recommend.list = res.goods.data;
          // 成功提示
          ctx.$toast.success("加载成功");
        });
      } else if (type === "new") {
        // 请求热销商品数据
        getHomeGoods({
          params: {
            new: 1,
            page: goods.new.page++,
          },
        }).then((res: any) => {
          // 赋值数据
          goods.new.list = res.goods.data;
          // 成功提示
          ctx.$toast.success("加载成功");
        });
      }
    };

    // 主屏 better-scroll滚动事件
    const scrollShow = (pos: any) => {
      if (pos.y < -600) {
        // 显示返回顶部图标
        isBackTopFixed.value = true;
      } else {
        // 隐藏返回顶部图标
        isBackTopFixed.value = false;
      }
    };

    // 返回顶部事件
    const changeIsBackTop = (type: boolean) => {
      // 调用子组件的方法
      ctx.$refs.homeScroll.backTop();
    };

    return {
      recomends,
      activeName,
      searchRightClick,
      goods,
      scrollToEnd,
      isBackTopFixed,
      scrollShow,
      changeIsBackTop,
    };
  },
  components: {
    NavBar,
    RecommendView,
    RecentlyRead,
    Scroll,
    Search,
    BackTop,
  },
};
</script>

<style lang="less" scoped>
.box {
  height: calc(100vh - 60px);
}
.content {
  padding-bottom: 85px;
}
.text {
  color: var(--color-high-text);
}
.van-tabs__line {
  width: 160px;
}
.portrait {
  width: 40px;
  height: 40px;
  background-color: #fff;
  box-shadow: 2px 2px 20px 2px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border: 1px solid #fff;
}
// 标题
.title {
  font-weight: 700;
}
// banner 内容
.banner {
  // padding: 15px 20px;
  border-radius: 15px;
  overflow: hidden;
  margin: 15px 20px;
}
.fixedNav {
  height: 60px;
}
</style>
