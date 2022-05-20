<template>
  <div class="box">
    <!-- navbar组件 -->
    <nav-bar path="/createOrder">
      <template v-slot:left>
        <!-- 图标 -->
        <van-icon name="arrow-left" />
      </template>
      <template v-slot:center>
        <div class="title">订单详情</div>
      </template>
      <template v-slot:right>
        <!-- 图标 -->
        <van-icon name="ellipsis" />
      </template>
    </nav-bar>

    <!--订单 -->
    <div class="order">
      <div class="orderStatus">
        <span>订单状态：</span>
        {{ statusString }}
      </div>
      <div class="orderNo">
        <span>订单编号：</span>
        {{ state.orderNo }}
      </div>
      <div class="createTime">
        <span>下单时间：</span>
        {{ state.createTime }}
      </div>
      <van-button
        v-if="state.status === 1"
        class="goToPay"
        round
        size="large"
        type="danger"
        @click="showPayFn"
        >去支付</van-button
      >
      <van-button
        v-if="state.status === 2"
        round
        size="large"
        class="confiremOrder"
        >确认订单</van-button
      >
    </div>
    <!-- 价钱 -->
    <div class="priceAndWay">
      <div class="price">
        <span>商品金额：</span>
        ${{ total }}
      </div>
      <div class="way">
        <span>配送方式：</span>
        普通快递
      </div>
    </div>
    <div class="scrollBox">
      <Scroll ref="scroll">
        <div class="orderList content">
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
      </Scroll>
    </div>
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
/* 导入路由 */
import { useRouter, useRoute } from "vue-router";
/* 导入api */
import { detailOrder, payOrder, payOrderStatus } from "@/network/order";
/* 导入Scroll组件 */
import Scroll from "components/common/scroll/Scroll.vue";
export default {
  name: "orderDetail",
  setup() {
    const { ctx }: any = getCurrentInstance();
    const router = useRouter();
    const route = useRoute();
    // 定时器
    let timer: any = "";
    // 总价
    const total = computed(() => {
      let sum = 0;
      state.cartList.forEach((item: any) => {
        sum += item.num * item.price;
      });
      return sum.toFixed(2);
    });

    // 数据模型，状态
    const state: any = reactive({
      orderId: 0,
      // 商品列表
      cartList: [],
      // 订单编号
      orderNo: 0,
      // 下单时间
      createTime: "0000 00:00:00",
      // 状态
      status: 0,
      // 支付宝
      aliyun: "",
      // 微信
      wechat: "",
      // 展示弹出层
      showPay: false,
    });

    // 初始化
    const init = () => {
      // 获取订单详情
      detailOrder(route.query.id).then((res: any) => {
        console.log(res);

        // 订单列表
        state.orderId = res.id;
        // 订单列表
        state.cartList = res.orderDetails.data;
        // 订单编号
        state.orderNo = res.order_no;
        // 订单创建时间
        state.createTime = res.updated_at;
        // 订单状态
        state.status = res.status;

        // 计算高度
        ctx.$refs.scroll.refresh();
      });
    };

    // 展示支付方式
    const showPayFn = () => {
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
          console.log(res);

          if (res === 2) {
            console.log(3);
            state.showPay = false;

            // 已经支付了
            clearInterval(timer);
            init();
          }
        });
      }, 2000);
    };

    // 没有支付
    const close = () => {
      // 清除定时器
      clearInterval(timer);

      state.showPay = false;
      // 跳转路由
      router.push({
        path: "/orderDetail",
        query: {
          id: state.orderId,
        },
      });
    };

    // 字符串
    const statusString = computed(() => {
      // 1.下单 2.支付 3.发货 4. 收货 5.过期
      let status = ["", "已下单", "已支付", "等待发货", "确认收货", "已过期"];
      // 返回字符串
      return status[state.status];
    });

    // 生命周期函数
    onMounted(() => {
      init();
    });

    return {
      state,
      total,
      statusString,
      showPayFn,
      close,
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
  background-color: #f8f8f8;
  .order {
    padding: 10px 15px;

    background-color: #fff;
    .orderStatus {
      padding: 5px 0;
      span {
        color: #ccc;
      }
    }

    .orderNo {
      padding: 5px 0;

      span {
        color: #ccc;
      }
    }

    .createTime {
      padding: 5px 0;

      span {
        color: #ccc;
      }
    }

    .goToPay {
      border-radius: 10px;
    }

    .confiremOrder {
      border-radius: 10px;
    }
  }
  .priceAndWay {
    padding: 10px 15px;
    margin: 10px 0;
    background-color: #fff;

    .price {
      padding: 5px 0;

      span {
        color: #ccc;
      }
    }

    .way {
      padding: 5px 0;

      span {
        color: #ccc;
      }
    }
  }
  .scrollBox {
    height: calc(100vh - 312px);
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
</style>
