<template>
  <!-- navbar组件 -->
  <nav-bar>
    <template v-slot:left>
      <!-- 图标 -->
      <van-icon name="arrow-left" />
    </template>
    <template v-slot:center>
      <div class="title">购物车</div>
    </template>
    <template v-slot:right>
      <!-- 图标 -->
      <van-icon name="ellipsis" />
    </template>
  </nav-bar>
  <div class="box">
    <Scroll ref="scroll">
      <div v-if="state.list.length !== 0" class="content">
        <!-- 商品列表 -->
        <div class="goodList">
          <van-checkbox-group v-model="state.result" @change="groupChange">
            <div v-for="(item, i) in state.list" class="goodItem">
              <van-swipe-cell>
                <div class="goodCard">
                  <div class="good">
                    <div class="matter">
                      <div class="img" @click="goDetail(item.goods_id)">
                        <img :src="item.goods.cover_url" />
                      </div>
                      <div class="detail">
                        <!-- 标题 -->
                        <div class="title">
                          {{ item.goods.title }}
                          <!-- 复选框按钮组 -->
                          <van-checkbox
                            :name="item.id"
                            checked-color="#f88358"
                          ></van-checkbox>
                        </div>

                        <!-- 作者 -->
                        <div class="auth">by zhengjiajun</div>
                        <!-- 评分 -->
                        <van-rate
                          color="#f88358"
                          size="15px"
                          v-model="rateValue"
                          readonly
                        />
                        <div class="NumAndPrice">
                          <!-- 数量 -->
                          <div class="num">
                            <!-- 添加购物车功能 -->
                            <div class="inp">
                              <button
                                class="flexCenter"
                                @click="changeGoodNumber(item.id, i, 'minus')"
                              >
                                <van-icon
                                  size="18"
                                  color="#b0b0b0"
                                  name="minus"
                                />
                              </button>
                              <input type="number" v-model="item.num" />
                              <button
                                class="flexCenter"
                                @click="changeGoodNumber(item.id, i, 'add')"
                              >
                                <van-icon
                                  size="18"
                                  color="#b0b0b0"
                                  name="plus"
                                />
                              </button>
                            </div>
                          </div>
                          <!-- 价格 -->
                          <div class="price">
                            ${{ item.goods.price.toFixed(2) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 右侧删除按钮 -->
                <template #right>
                  <van-button
                    @click="deleteCart(item.id)"
                    square
                    text="删除"
                    color="#f88358"
                    class="delete-button"
                  />
                </template>
              </van-swipe-cell>
            </div>
          </van-checkbox-group>
        </div>
        <!-- 提交订单面板 -->
        <div class="settlement">
          <div class="total">
            <van-checkbox
              @click="allCheck"
              v-model:checked="state.checkAll"
              checked-color="#f88358"
              >全选</van-checkbox
            >
            <h2><span>合计: </span>${{ total }}</h2>
          </div>
          <div class="promoCo">
            <div>Promo Code</div>
            <div class="tips">
              AHS7562
            </div>
          </div>
          <!-- 提交订单 -->
          <van-button color="#fa784a" size="large" @click="settlement"
            >提交订单</van-button
          >
        </div>
      </div>
      <div class="noCartList" v-else>
        <img
          src="https://upfile.asqql.com/simg/2017-4/20174710412325909.JPG"
          alt=""
        />
        <h3>暂无商品，快去添加购物车吧!</h3>
      </div>
    </Scroll>
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  ref,
  reactive,
  getCurrentInstance,
  computed,
  onActivated,
} from "vue";
import { useRouter } from "vue-router";
// api
import {
  getCartList,
  deleteCartItem,
  changeCheckCart,
  modifyCart,
} from "@/network/shopCart";

/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
/* 导入滚动条组件 */
import Scroll from "components/common/scroll/Scroll.vue";
export default {
  name: "shopcart",
  setup() {
    // 评分
    const rateValue = ref(5);
    // ctx
    const { ctx }: any = getCurrentInstance();
    // 路由
    const router = useRouter();
    // 数据模型，状态
    const state: any = reactive({
      // 商品列表
      list: [],
      // id数组
      result: [],
      // 是否全选
      checkAll: true,
    });

    // 总价
    const total = computed(() => {
      let sum = 0;
      // 过滤下result数组里面id相同的商品
      state.list
        .filter((item: any) => state.result.includes(item.id))
        .forEach((item: any) => {
          // 计算总价
          sum += item.num * item.goods.price;
        });
      // 返回计算的值
      return sum.toFixed(2);
    });

    // 初始化
    const init = () => {
      // 请求购物车数据
      getCartList("include=goods").then((res: any) => {
        // 赋值商品list
        state.list = res.data;
        // 过滤选中的商品,并且为result添加id
        state.result = res.data
          .filter((n: any) => n.is_checked == 1)
          .map((item: any) => item.id);
        // 重新计算高度
        ctx.$refs.scroll.refresh();
      });
    };

    // 被缓存的时候
    onActivated(() => {
      // 重新初始化
      init();
    });
    // 生命周期函数
    onMounted(() => {
      ctx.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      init();
    });

    // 结算
    const settlement = () => {
      // 选中的数组有东西才跳转
      if (state.result.length === 0) {
        ctx.$toast("请先选中商品再进行结算");
      } else {
        // 跳转
        router.push("/createOrder");
      }
    };

    // 改变商品数量
    const changeGoodNumber = (id: number, i: number, type: string) => {
      if (type === "add") {
        // +1
        state.list[i].num++;
        // 修改购物车数量
        modifyCart(id, state.list[i].num);
      } else {
        if (state.list[i].num === 0) {
          return;
        }
        // -1
        state.list[i].num--;
        // 修改购物车数量
        modifyCart(id, state.list[i].num);
      }
    };

    // 移除购物车
    const deleteCart = (id: number) => {
      deleteCartItem(id).then((res) => {
        console.log(res);
        ctx.$toast("删除成功!");
        // 初始化
        init();
      });
    };

    // 复选框组改变处理
    const groupChange = (result: any) => {
      // 如果 result数组id数量跟list的数量一样
      if (state.result.length === state.list.length) {
        // 设置全选
        state.checkAll = true;
      } else {
        // 不全选
        state.checkAll = false;
      }
      // 请求改变checked状态
      changeCheckCart(result).then((res) => {
        console.log(res);
      });
    };

    // 全选按钮被点击
    const allCheck = () => {
      if (!state.checkAll) {
        // 给result数组 添加所有的id
        state.result = state.list.map((item: any) => item.id);
        state.checkAll = true;
      } else {
        state.result = [];

        state.checkAll = false;
      }
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
      rateValue,
      changeGoodNumber,
      total,
      deleteCart,
      state,
      groupChange,
      allCheck,
      settlement,
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
.text {
  color: var(--color-high-text);
}
.goods-card {
  margin: 0;
  background-color: #fff;
}

.delete-button {
  height: 100%;
}
.box {
  height: calc(100vh - 60px);
  .content {
    background-color: #fcfcfc;
    padding-bottom: 82px;
    .goodCard {
      padding: 10px 15px 10px 15px;
      .good {
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
              .num {
                .inp {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  button {
                    height: 100%;
                    background-color: #f7f7f7;
                    border: none;
                    outline: none;
                  }

                  input {
                    display: block;
                    height: 100%;
                    color: #45ae9e;
                    width: 40px;
                    text-align: center;
                    border: none;
                    background-color: #f7f7f7;
                    font-weight: 700;
                    height: 100%;
                  }
                }
              }

              .price {
                font-weight: 700;
                color: #74c0b4;
              }
            }
          }
        }
      }
    }

    .settlement {
      background-color: #fff;
      border-radius: 15px;
      padding: 15px;
      .total {
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
        h2 {
          span {
            font-weight: 700;
            font-size: 16px;
          }
        }
      }

      .promoCo {
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;

        .tips {
          padding: 5px;
          background-color: #f7f7f7;
          color: #74c0b4;
        }
      }
      .van-button {
        border-radius: 15px !important;
      }
    }
  }
  .noCartList {
    padding: 15px;
    h3 {
      text-align: center;
      padding: 10px 0;
    }
    img {
    }
  }
}
</style>
