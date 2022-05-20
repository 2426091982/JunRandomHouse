<template>
  <div class="box">
    <!-- navbar组件 -->
    <nav-bar>
      <template v-slot:left>
        <!-- 图标 -->
        <van-icon name="arrow-left" />
      </template>
      <template v-slot:center>
        <div class="title">我的收藏</div>
      </template>
      <template v-slot:right>
        <!-- 图标 -->
        <van-icon name="ellipsis" />
      </template>
    </nav-bar>

    <!-- 商品列表 -->
    <div class="goodList">
      <div v-for="(item, i) in collectList" class="goodItem">
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
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧删除按钮 -->
          <template #right>
            <van-button
              @click="collectGoods(item.goods_id, i)"
              square
              text="取消收藏"
              color="#f88358"
              class="collect-button"
            />
          </template>
        </van-swipe-cell>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, getCurrentInstance, toRefs, reactive } from "vue";
/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
/* 导入路由 */
import { useRoute, useRouter } from "vue-router";

// 导入收藏api
import { myCollects, collects } from "@/network/collects";

export default {
  name: "myCollect",
  setup() {
    // 获取路由
    const route = useRoute();
    const router = useRouter();
    const { ctx }: any = getCurrentInstance();
    // 当前收藏列表的数据
    const state = reactive({
      // 收藏列表
      collectList: [],
      page: 1,
      // 评分
      rateValue: 4.5,
    });

    onMounted(() => {
      // 获取收藏列表
      myCollects(state.page).then((res: any) => {
        console.log(res);
        // 赋值列表
        state.collectList = res.data;
      });
    });

    // 收藏商品或取消收藏商品
    const collectGoods = (goodId: number, index: number) => {
      // 收藏或者取消收藏
      collects(goodId).then((res) => {
        if (res.status === 201) {
          ctx.$toast("收藏成功");
        } else if (res.status === 204) {
          ctx.$toast("取消收藏成功");
          // 删除掉
          state.collectList.splice(index, 1);
        }
      });
    };

    return { ...toRefs(state), collectGoods };
  },
  components: {
    NavBar,
  },
};
</script>

<style lang="less" scoped>
.collect-button {
  height: 100%;
  width: 60px;
  line-height: 20px;
}
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
      }
    }
  }
}
</style>
