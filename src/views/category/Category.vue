<template>
  <div class="box">
    <!-- navbar组件 -->
    <nav-bar>
      <template v-slot:left>
        <!-- 图标 -->
        <van-icon name="arrow-left" />
      </template>
      <template v-slot:center>
        <div class="title">分类</div>
      </template>
      <template v-slot:right>
        <!-- 图标 -->
        <van-icon name="ellipsis" />
      </template>
    </nav-bar>
    <van-row>
      <van-col span="8"></van-col>
      <van-col span="16">
        <!-- tab标签页 -->
        <van-tabs
          @click="tabClick"
          color="#f88358"
          title-active-color="#f88358"
          v-model:active="tabActive"
        >
          <!-- 点击后会切换排序方式 -->
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评化排序"></van-tab>
        </van-tabs>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="8">
        <van-sidebar v-model="sidebarActive">
          <!-- 折叠框 -->
          <van-collapse v-model="activeNames" accordion>
            <van-collapse-item title="热门" name="Hot">
              <div class="sildebarBox">
                <!-- 侧边导航栏 -->
                <van-sidebar-item
                  title="热门技术"
                  @click="categoryIdChange(0)"
                />
              </div>
              <div class="sildebarBox">
                <!-- 侧边导航栏 -->
                <van-sidebar-item
                  title="最新技术"
                  @click="categoryIdChange(1)"
                />
              </div>
            </van-collapse-item>
            <van-collapse-item
              v-for="item1 in categories"
              :title="item1.name"
              :key="item1.id"
              :name="item1.name"
            >
              <div class="sildebarBox">
                <!-- 侧边导航栏 -->
                <van-sidebar-item
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  :title="item2.name"
                  @click="categoryIdChange(item2.id)"
                />
              </div>
            </van-collapse-item>
          </van-collapse>
        </van-sidebar>
      </van-col>
      <van-col span="16">
        <div class="goodsList">
          <Scroll @scrollToEndY="goodScrollEnd" ref="scrollChild">
            <van-pull-refresh v-model="loading" @refresh="onRefresh">
              <!-- 商品列表 -->
              <div class="content">
                <van-card
                  v-if="showGoods.length !== 0"
                  v-for="item in showGoods"
                  :key="item.id"
                  :num="item.comments_count"
                  :tag="item.comments_count >= 0 ? '流行' : '标签'"
                  :price="item.price"
                  :desc="item.updated_at"
                  :title="item.title"
                  :thumb="item.cover_url"
                  :lazy-load="true"
                  @click="hrefDetailPath(item.id)"
                />
                <!-- 没数据就显示为空 -->
                <van-empty v-else image="error" description="暂无书籍" />
              </div>
            </van-pull-refresh>
          </Scroll>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, reactive, computed, getCurrentInstance } from "vue";
// 导入请求api
import { getCategory, getCategoryGoods } from "@/network/category";
// 导入路由
import { useRouter } from "vue-router";
/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
/* 导入滚动条组件 */
import Scroll from "components/common/scroll/Scroll.vue";
export default {
  name: "category",
  setup() {
    // 获取ctx
    const { ctx }: any = getCurrentInstance();
    // 获取路由
    const router = useRouter();
    // tab标签页默认
    const tabActive = ref(0);
    // 侧边栏选中
    const sidebarActive = ref(0);
    // 折叠框选中
    const activeNames = ref("Hot");
    // categories 分类数据
    let categories = ref([]);
    // 当前的分类id 默认2
    const categoryId = ref(0);
    // 当前的排序方式 默认销售排序
    const orderWay = ref("sales");
    // 显示加载组件
    const loading = ref(false);

    // 上滑刷新
    const onRefresh = () => {
      //  获取分类id对应的数据
      getCategoryGoods(orderWay.value, categoryId.value).then((res: any) => {
        goods[orderWay.value].list = res.goods.data;
        // 重新计算高度
        ctx.$refs.scrollChild.refresh();
        // 关闭加载组件
        loading.value = false;
        // 提示加载成功
        ctx.$toast("刷新成功");
      });
    };

    // tab标签点击切换当前排序方式
    const tabClick = () => {
      if (tabActive.value === 0) {
        // 排序方式为销量排序
        orderWay.value = "sales";
      } else if (tabActive.value === 1) {
        // 排序方式为销量排序
        orderWay.value = "price";
      } else if (tabActive.value === 2) {
        // 排序方式为评论排序
        orderWay.value = "comments_count";
      }
      //  获取分类id对应的数据
      getCategoryGoods(orderWay.value, categoryId.value).then((res: any) => {
        goods[orderWay.value].list = res.goods.data;
        // 重新计算高度
        ctx.$refs.scrollChild.refresh();
      });
    };

    // 商品数据模型
    const goods: any = reactive({
      sales: { page: 1, list: [] },
      price: { page: 1, list: [] },
      comments_count: { page: 1, list: [] },
    });

    // 展示商品
    const showGoods = computed(() => {
      // 返回对应排序的数组
      return goods[orderWay.value].list;
    });

    // 初始化
    const init = () => {
      ctx.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      //  获取分类id对应的数据
      getCategoryGoods("sales", categoryId.value).then((res: any) => {
        goods.sales.list = res.goods.data;
        console.log(goods);

        // 重新计算高度
        ctx.$refs.scrollChild.refresh();
      });
      //  获取分类id对应的数据
      getCategoryGoods("price", categoryId.value).then((res: any) => {
        goods.price.list = res.goods.data;
        // 重新计算高度
        ctx.$refs.scrollChild.refresh();
      });
      //  获取分类id对应的数据
      getCategoryGoods("comments_count", categoryId.value).then((res: any) => {
        goods.comments_count.list = res.goods.data;
        // 重新计算高度
        ctx.$refs.scrollChild.refresh();
      });
    };

    // 生命周期
    onMounted(() => {
      // 获取分类tab数据
      getCategory().then((res: any) => {
        categories.value = res.categories;
        // 重新计算高度
        ctx.$refs.scrollChild.refresh();
      });

      //  获取分类id对应的数据 初始化
      init();
    });

    // 点击分类，分类id改变,请求新的数据
    const categoryIdChange = (id: any) => {
      categoryId.value = id;
      //  获取分类id对应的数据
      getCategoryGoods(orderWay.value, categoryId.value).then((res: any) => {
        goods[orderWay.value].list = res.goods.data;
        // 重新计算高度
        ctx.$refs.scrollChild.refresh();
      });
    };

    // 滚动到底部加载更多数据
    const goodScrollEnd = () => {
      // 页数+ 1
      const page = goods[orderWay.value].page + 1;

      //  获取分类id对应的数据
      getCategoryGoods(orderWay.value, categoryId.value, page).then(
        (res: any) => {
          // 向列表追加数据
          goods[orderWay.value].list.push(...res.goods.data);

          // 重新计算高度
          ctx.$refs.scrollChild.refresh();
          // 提示加载成功
          ctx.$toast("加载成功");
        }
      );
    };

    // 跳转详情路由
    const hrefDetailPath = (id: number) => {
      // 路由跳转
      router.push({ path: "/detail", query: { id } });
    };

    return {
      sidebarActive,
      activeNames,
      categories,
      categoryIdChange,
      tabActive,
      categoryId,
      tabClick,
      init,
      showGoods,
      goodScrollEnd,
      onRefresh,
      loading,
      hrefDetailPath,
    };
  },
  components: {
    NavBar,
    Scroll,
  },
};
</script>

<style lang="less" scoped>
// 大盒子
.box {
  height: calc(100vh - 60px);
}
// 滚动条内容
.content {
  padding-bottom: 85px;
}
// 导航栏
.van-sidebar {
  width: 100% !important;
}
// 商品列表
.goodsList {
  height: calc(100vh - 60px - 44px);
}
.sildebarBox {
  max-height: 300px;
  overflow: scroll;
}
</style>
