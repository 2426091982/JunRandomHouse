<template>
  <!-- navbar组件 -->
  <nav-bar path="/createOrder">
    <template v-slot:left>
      <!-- 图标 -->
      <van-icon name="arrow-left" />
    </template>
    <template v-slot:center>
      <div class="title">提交订单</div>
    </template>
    <template v-slot:right>
      <!-- 图标 -->
      <van-icon name="ellipsis" />
    </template>
  </nav-bar>
  <div class="box">
    <Scroll ref="scroll">
      <div class="content">
        <!-- 当前地址 -->
        <div class="address">
          <div class="info">
            <div class="name">
              {{ state.address.name }} {{ state.address.phone }}
            </div>
            <div class="addressDetail ">
              {{ state.address.province }} {{ state.address.city }}
              {{ state.address.county }}
              {{ state.address.address }}
            </div>
          </div>
          <div class="icon flexCenter" @click="$router.push('/addressList')">
            <i class="iconfont icon-youjiantou"></i>
          </div>
        </div>
        <!-- 订单列表 -->
        <div class="orderList ">
          <div v-for="(item, i) in state.cartList" class="orderItem">
            <div class="orderCard">
              <div class="order">
                <div class="matter">
                  <div class="img" @click="goDetail(item.goods_id)">
                    <img :src="item.goods.cover_url" />
                  </div>
                  <div class="detail">
                    <!-- 标题 -->
                    <div class="title">
                      {{ item.goods.title }}
                    </div>

                    <!-- 作者 -->
                    <div class="auth">by zhengjiajun</div>

                    <div class="NumAndPrice">
                      <!-- 价格 -->
                      <div class="price">
                        ${{ item.goods.price.toFixed(2) }}
                      </div>
                      <div class="num">
                        x<span>{{ item.num }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Scroll>
  </div>

  <!-- 提交订单栏 -->
  <van-submit-bar
    :price="total"
    button-text="提交订单"
    @submit="onSubmit"
    button-color="#f88358"
  >
    <h3>商品金额:</h3>
  </van-submit-bar>
  <!-- 弹出层 -->
  <van-popup
    v-model:show="state.showPay"
    position="bottom"
    :style="{ height: '35%' }"
    @close="close"
  >
    <van-grid :border="false" :column-num="2">
      <van-grid-item>
        <h3>支付宝二维码</h3>
        <van-image :src="state.aliyun" />
      </van-grid-item>
      <van-grid-item>
        <h3>微信二维码</h3>
        <van-image :src="state.wechat" />
      </van-grid-item>
    </van-grid>
  </van-popup>
</template>

<script lang="ts">
import {
  onMounted,
  ref,
  getCurrentInstance,
  reactive,
  onActivated,
  computed,
} from "vue";
/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";

/* 导入Scroll组件 */
import Scroll from "components/common/scroll/Scroll.vue";
/* 导入路由 */
import { useRoute, useRouter } from "vue-router";
// 导入请求api
import {
  createOrder,
  submitOrder,
  payOrder,
  payOrderStatus,
} from "@/network/order";
// 导入store
import { useStore } from "vuex";

export default {
  name: "createOrder",
  setup() {
    // 获取ctx
    const { ctx }: any = getCurrentInstance();
    // 路由
    const router = useRouter();
    let timer: any = "";
    // 数据模型，状态
    const state: any = reactive({
      // 商品列表
      cartList: [],
      // 地址
      address: {},
      // 是否显示支付方式
      showPay: false,
      // 订单编号
      orderNo: "",
      // 阿里云支付码
      aliyun: "",
      // 微信支付码
      wechat: "",
    });
    // 获取store
    const store = useStore();

    // 计算总价
    const total = computed(() => {
      let sum = 0;
      // 过滤下result数组里面id相同的商品
      state.cartList.forEach((item: any) => {
        // 计算总价
        sum += item.num * item.goods.price;
      });
      // 返回计算的值
      return sum * 100;
    });

    // 初始化
    const init = () => {
      state.showPay = false;

      createOrder().then((res: any) => {
        console.log(res);

        // 使用默认的地址
        let address = res.address.filter((n: any) => n.is_default == "1");
        if (address.length == 0) {
          state.address = {
            address: "还没有设置默认地址，请选中或填写地址信息",
          };
        } else {
          // 赋值地址
          state.address = address[0];
        }
        // 赋值
        state.cartList = res.carts;
        // 重新计算高度
        ctx.$refs.scroll.refresh();
      });
    };

    // 创建订单
    const onSubmit = () => {
      //创建订单
      submitOrder(state.address.id).then((res: any) => {
        console.log(res);
        ctx.$toast("创建订单成功");
        // 重新获取购物车数量
        store.dispatch("updateCartCount");

        state.orderId = res.id;

        // 获取支付二维码
        payOrder(state.orderId, { type: "aliyun" }).then((res: any) => {
          console.log(res);
          state.aliyun = res.qr_code_url;
          state.wechat = res.qr_code_url;
          state.showPay = true;
        });

        /* 轮询查看订单状态 */
        timer = setInterval(() => {
          payOrderStatus(state.orderId).then((res: any) => {
            if (res === 2) {
              state.showPay = false;

              // 已经支付了
              clearInterval(timer);
              // 跳转路由
              router.replace({
                path: "/orderDetail",
                query: {
                  id: state.orderId,
                },
              });
            }
          });
        }, 2000);
      });
    };

    onMounted(() => {
      ctx.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      init();
    });

    onActivated(() => {
      init();
    });

    // 没有支付
    const close = () => {
      // 清除定时器
      clearInterval(timer);

      // 跳转路由
      router.replace({
        path: "/orderDetail",
        query: {
          id: state.orderId,
        },
      });
      state.showPay = false;
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
      close,
      state,
      total,
      onSubmit,
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
    padding: 0 15px 50px;
    .address {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f7f7f7;

      border-radius: 10px;
      padding: 15px;
      .info {
        font-size: 14px;
        padding-right: 10px;
        .name {
          padding-bottom: 5px;
          font-weight: 700;
        }

        .addressDetail {
        }
      }

      .icon {
        i.iconfont.icon-youjiantou {
        }
      }
    }
    .orderCard {
      padding: 10px 0;
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
</style>
