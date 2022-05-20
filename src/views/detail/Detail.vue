<template>
  <div class="box">
    <!-- navbar组件 -->
    <nav-bar>
      <template v-slot:left>
        <!-- 图标 -->
        <van-icon name="arrow-left" />
      </template>
      <template v-slot:center>
        <div class="title">商品详情</div>
      </template>
      <template v-slot:right>
        <!-- 图标 -->
        <van-icon name="ellipsis" />
      </template>
    </nav-bar>
    <!-- 展示图片组件 -->
    <div class="showBook flexCenter">
      <van-image
        width="200"
        class="showImage"
        lazy-load
        round
        :src="good.cover_url"
        alt=""
      />
    </div>
    <!-- 书籍详情 -->
    <div class="bookDetail">
      <div class="price">${{ good.price }}.00</div>
      <div class="detail">
        <div class="title">{{ good.title }}</div>
        <!-- 收藏图标 -->
        <div @click="collectGoods(good.id)" class="collection flexCenter">
          <van-icon
            size="18"
            name="star"
            :color="isCollect ? '#f88358' : '#fff'"
          />
        </div>
      </div>
      <div class="description">{{ good.description }}</div>
      <div class="Introduction">
        《JavaScript程序设计》是2009年人民邮电出版社出版的图书，作者是邹天思。
        本书主要介绍了JavaScript概述、HTML文档、JavaScript语言基础、JavaScript常用内置对象、事件处理、JavaScript常用文档对象、JavaScript常用窗口对象、级联样式表(CSS)、JavaScript中的XML、Ajax技术以及JavaScript实用技巧与高级应用等内容。
      </div>
      <div class="actionBar">
        <div class="left">
          <div class="qty">
            QTY
          </div>
          <!-- 添加购物车功能 -->
          <div class="inp">
            <button @click="changeGoodNumber('minus')">
              <van-icon size="18" color="#b0b0b0" name="minus" />
            </button>
            <input type="number" v-model="goodNumber" />
            <button @click="changeGoodNumber('add')">
              <van-icon size="18" color="#b0b0b0" name="plus" />
            </button>
          </div>
        </div>
        <div class="right">
          <button @click="addToCart">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, getCurrentInstance } from "vue";
/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
/* 导入路由 */
import { useRoute, useRouter } from "vue-router";
// 导入请求api
import { getDetail, addCart } from "@/network/detail";
// 导入收藏api
import { collects } from "@/network/collects";
// 导入store
import { useStore } from "vuex";

export default {
  name: "detail",
  setup() {
    // 获取路由
    const route = useRoute();
    const router = useRouter();
    // 当前商品的数据
    const good = ref([]);
    // 获取当前的id 默认为 1
    const id = route.query.id || 1;
    // 要加入购物车的商品数量
    const goodNumber = ref(1);
    // 获取ctx
    const { ctx }: any = getCurrentInstance();
    // 获取store
    const store = useStore();
    // 是否收藏
    const isCollect = ref(false);
    // 改变商品数量
    const changeGoodNumber = (type: string) => {
      if (type === "add") {
        goodNumber.value++;
      } else {
        if (goodNumber.value === 0) {
          return;
        }
        goodNumber.value--;
      }
    };

    // 加入购物车
    const addToCart = () => {
      // 添加购物车
      addCart(id, goodNumber.value).then((res: any) => {
        ctx.$toast("添加购物车成功!");
        // 分发事件,更新购物车数量图标
        store.dispatch("updateCartCount");
      });
    };

    // 生命周期
    onMounted(() => {
      // 请求商品详情数据
      getDetail(id).then((res: any) => {
        console.log(res);

        good.value = res.goods;
        // 收藏了
        if (res.goods.is_collect === 1) {
          isCollect.value = true;
        }
      });
    });

    // 收藏商品或取消收藏商品
    const collectGoods = (goodId: number) => {
      // 收藏或者取消收藏
      collects(goodId).then((res) => {
        if (res.status === 201) {
          ctx.$toast("收藏成功");
          // 收藏
          isCollect.value = true;
        } else if (res.status === 204) {
          ctx.$toast("取消收藏成功");
          // 不收藏
          isCollect.value = false;
        }
      });
    };

    return {
      id,
      goodNumber,
      good,
      changeGoodNumber,
      addToCart,
      collectGoods,
      isCollect,
    };
  },
  components: {
    NavBar,
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: #f0f0f0;
}
.text {
  color: var(--color-high-text);
}
// 展示书籍
.showBook {
  padding: 40px 0;
  .showImage {
    border-radius: 15px !important;
  }
}

// 书籍详情
.bookDetail {
  height: 200px;
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  .price {
    font-size: 22px;
    font-weight: 700;
    color: #63b9ab;
  }

  .detail {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 24px;
      font-weight: 700;
    }

    .collection {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #f0f0f0;
    }
  }

  .description {
    color: #bdbdbd;
    font-size: 18px;
    font-weight: 700;
  }
  .Introduction {
    margin: 15px 0;
    font-size: 14px;
    line-height: 20px;
    max-height: 120px;
    overflow: scroll;
  }
}
.actionBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    width: 200px;
    display: flex;
    background-color: #f7f7f7;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    .qty {
      color: #666;
      text-align: center;
      line-height: 40px;
      font-weight: 700;
    }

    .inp {
      button {
        height: 100%;
        background-color: #f7f7f7;
        border: none;
        outline: none;
      }

      input {
        color: #45ae9e;
        width: 40px;
        text-align: center;
        border: none;
        background-color: #f7f7f7;
        font-weight: 700;
      }
    }
  }

  .right {
    button {
      padding: 15px 20px;
      background-color: var(--color-high);
      color: #fff;
      border-radius: 10px;
      border: none;
    }
  }
}
</style>
