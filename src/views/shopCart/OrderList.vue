<template>
  <div class="box">
    <!-- navbar组件 -->
    <nav-bar path="/createOrder">
      <template v-slot:left>
        <!-- 图标 -->
        <van-icon name="arrow-left" />
      </template>
      <template v-slot:center>
        <div class="title">订单列表</div>
      </template>
      <template v-slot:right>
        <!-- 图标 -->
        <van-icon name="ellipsis" />
      </template>
    </nav-bar>

    <!-- tab栏 -->
    <van-tabs @click="activeChange" v-model:active="active" color="#f88358">
      <van-tab title="全部"></van-tab>
      <van-tab title="待付款"></van-tab>
      <van-tab title="已支付"></van-tab>
      <van-tab title="发货"></van-tab>
      <van-tab title="交易完成"></van-tab>
      <van-tab title="过期"></van-tab>
    </van-tabs>
    <Scroll ref="scroll">
      <div class="content">
        <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="state.loading"
            :finished="state.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div class="orderItem" v-for="item in state.list" :key="item.id">
              <div class="orderInfo">
                <div class="orderNo">
                  <span>订单编号:</span>
                  {{ item.order_no }}
                </div>
                <div class="createTime">
                  <span>创建时间:</span>
                  {{ item.created_at }}
                </div>
              </div>
              <div class="orderList content">
                <div
                  v-for="(item2, i) in item.orderDetails.data"
                  class="orderItem"
                >
                  <div class="orderCard">
                    <div class="order">
                      <div class="matter">
                        <div class="img" @click="goDetail(item2.goods_id)">
                          <img :src="item2.goods.cover_url" />
                        </div>
                        <div class="detail">
                          <!-- 标题 -->
                          <div class="title">
                            {{ item2.goods.title }}
                          </div>

                          <!-- 作者 -->
                          <div class="auth">by zhengjiajun</div>

                          <div class="NumAndPrice">
                            <!-- 价格 -->
                            <div class="price">
                              ${{ item2.goods.price.toFixed(2) }}
                            </div>
                            <div class="num">
                              x<span>{{ item2.num }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </Scroll>
  </div>
</template>

<script lang="ts">
/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
/* 导入vue */
import {
  reactive,
  ref,
  onMounted,
  toRefs,
  computed,
  getCurrentInstance,
} from "vue";
/* 导入api */
import { orderList } from "@/network/order";
/* 导入Scroll组件 */
import Scroll from "components/common/scroll/Scroll.vue";
/* router */
import { useRouter, useRoute } from "vue-router";
export default {
  name: "orderList",
  setup() {
    // 切换栏
    const active = ref(0);
    const router = useRouter();
    const route = useRoute();
    // ctx
    const { ctx }: any = getCurrentInstance();
    // 数据
    const state: any = reactive({
      list: [],
      // 是否加载
      loading: false,
      // 是否加载完成
      finished: false,
      // 是否显示下拉刷新条
      refreshing: false,
      // 页数
      page: 1,
    });

    // 加载
    const onLoad = () => {
      // 刷新
      if (state.refreshing) {
        console.log(1);

        // 清空数组
        state.list = [];
        // 关闭下拉刷新条
        state.refreshing = false;
      }

      // 订单数据
      orderList({
        // 加页
        page: state.page++,
        //状态
        status: active.value,
      }).then((res: any) => {
        // 链接数组
        state.list.push(...res.data);
        // 重新计算高度
        ctx.$refs.scroll.refresh();
        console.log(state.list);
        console.log(state.page);

        if (res.data.length === 0) {
          // 加载完毕
          state.finished = true;
        }

        // 关闭下拉刷新条
        state.loading = false;
      });
    };

    // 下拉刷新
    const onRefresh = () => {
      // 清空列表数据，未加载完成
      state.finished = false;

      // 重新加载数据
      state.refreshing = true;
      // 将 loading 设置为 true，表示处于加载状态
      state.loading = true;
      // 重置页数
      state.page = 1;
      onLoad();
    };

    // 改变订单类型
    const activeChange = (a: any, b: any) => {
      state.finished = false;
      onRefresh();
    };

    // 跳转详情
    const goDetail = (id: number) => {
      // 跳转到详情,传参数
      router.push({
        path: "/detail",
        query: { id },
      });
    };

    return {
      active,
      state,
      onLoad,
      onRefresh,
      activeChange,
      goDetail,
    };
  },
  components: {
    NavBar,
    Scroll,
  },
};
</script>

<style lang="less" scoped>
.box {
  height: calc(100vh - 60px);
  .content {
    padding-bottom: 10px;
    .orderItem {
      .orderInfo {
        padding: 15px;
        background-color: #f7f7f7;

        .orderNo {
          span {
            font-weight: 700;
            margin-right: 10px;
          }
        }
        .createTime {
          margin-top: 10px;
          span {
            font-weight: 700;
            margin-right: 10px;
          }
        }
      }
      .orderCard {
        padding: 15px;
        background-color: #fff;
        .order {
          background-color: #f7f7f7;
          border-radius: 15px;
          .matter {
            display: flex;
            padding: 10px 15px;
            .img {
              width: 80px;
              height: 100px;
              img {
                border-radius: 15px;
                width: 100%;
                height: 100%;
              }
              margin-right: 15px;
            }

            .detail {
              flex: 1;
              .title {
                font-weight: 700;
                color: #666;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }

              .auth {
                color: #bdbdbd;
                padding: 5px 0;
              }

              .NumAndPrice {
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .price {
                  font-weight: 700;
                  color: #74c0b4;
                }
                .num {
                  color: var(--color-high);
                  font-size: 12px;
                  font-weight: 700;
                  span {
                    font-size: 14px;
                    margin-left: 5px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
