<template>
  <div class="box">
    <!-- 退出登录组件 -->
    <div class="loginBox">
      <div @click="loginToOut" class="loginOut flexCenter">
        <i class="iconfont icon-tuichudenglu"></i>
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="userInfo">
      <!-- 头像 -->
      <div class="portrait">
        <img :src="userInfo.avatar_url" alt="" />
      </div>
      <!-- 用户名 -->
      <h3>{{ userInfo.name }}</h3>
      <!-- 个性签名 -->
      <div class="signature">
        10行代码，9个bug。
      </div>
    </div>
    <!-- 功能栏 -->
    <div class="functionBar">
      <div class="item" @click="$router.push('/collect')">
        <div class="left flexCenter">
          <i class="iconfont icon-shoucang"></i>
        </div>
        <div class="middle">
          我的收藏
        </div>
        <div class="right flexCenter">
          <i class="iconfont icon-youjiantou"></i>
        </div>
      </div>
      <div class="item" @click="$router.push('/orderList')">
        <div class="left flexCenter">
          <i class="iconfont icon-dingdan"></i>
        </div>
        <div class="middle">
          我的订单
        </div>
        <div class="right flexCenter">
          <i class="iconfont icon-youjiantou"></i>
        </div>
      </div>
      <div class="item" @click="$router.push('/setting')">
        <div class="left flexCenter">
          <i class="iconfont icon-ziyuan143"></i>
        </div>
        <div class="middle">
          账号管理
        </div>
        <div class="right flexCenter">
          <i class="iconfont icon-youjiantou"></i>
        </div>
      </div>
      <div class="item" @click="$router.push('/addressList')">
        <div class="left flexCenter">
          <i class="iconfont icon-dizhi"></i>
        </div>
        <div class="middle">
          地址管理
        </div>
        <div class="right flexCenter">
          <i class="iconfont icon-youjiantou"></i>
        </div>
      </div>
      <div class="item" @click="$router.push('/about')">
        <div class="left flexCenter">
          <i class="iconfont icon-guanyu"></i>
        </div>
        <div class="middle">
          关于我们
        </div>
        <div class="right flexCenter">
          <i class="iconfont icon-youjiantou"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, toRefs, getCurrentInstance, reactive } from "vue";
import { loginOut, getUserInfo } from "@/network/profile";
/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
export default {
  name: "profile",
  setup() {
    // ctx
    const { ctx }: any = getCurrentInstance();
    // 用户信息
    const state = reactive({
      userInfo: {},
    });
    // 生命周期
    onMounted(() => {
      getUserInfo().then((res) => {
        state.userInfo = res;
        console.log(res);
      });
    });

    // 退出登录
    const loginToOut = () => {
      ctx.$dialog
        .confirm({
          message: "是否退出登录？",
        })
        .then(() => {
          // 退出登录
          loginOut().then((res: any) => {
            console.log(res);
            ctx.$toast("退出登录成功");
            // 清空token
            localStorage.setItem("token", "");
          });
        })
        .catch(() => {
          // 取消
          ctx.$toast("已取消退出");
        });
    };

    return { loginToOut, ...toRefs(state) };
  },
  components: {
    NavBar,
  },
};
</script>

<style lang="less" scoped>
.text {
  color: var(--color-high-text);
}
 
.box {
  background-color: #f7f8fa;
  height: 100vh;
  overflow: hidden;
  padding: 20px 15px;
  .loginBox {
    display: flex;
    justify-content: flex-end;
    .loginOut {
      width: 40px;
      height: 40px;
      background-color: #fff;
      border-radius: 50%;
      .icon-tuichudenglu {
        font-size: 20px;
        font-weight: 700;
        color: rgb(248, 131, 88);
      }
    }
  }
  .userInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .portrait {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      padding: 2px;
      background-color: #fff;
      box-shadow: 2px 2px 20px 2px rgba(0, 0, 0, 0.3);
      img {
        border-radius: 50%;
        background-size:cover;
      }
    }

    h3 {
      padding: 10px 0;
      font-size: 20px;
    }

    .signature {
      color: #ccc;
      font-size: 14px;
    }
  }

  .functionBar {
    border-radius: 15px;
    margin-top: 50px;
    padding: 15px;
    background-color: #fff;
    .item {
      display: flex;
      padding: 15px 0;
      .left {
        width: 60px;
        .icon-shoucang {
          color: #ffbd49;
        }
        .icon-youjiantou {
          columns: #36c852;
        }
        .icon-dingdan {
          color: #5e88ff;
        }
        .icon-ziyuan143 {
          color: #ff7675;
        }
        .icon-dizhi {
          color: #ce7fff;
        }
        .icon-guanyu {
          color: pink;
        }
      }
      .middle {
        flex: 1;
        font-size: 18px;
      }

      .right {
        width: 40px;
        i {
          font-size: 14px;
        }
        .icon-youjiantou {
        }
      }
    }
  }
}
</style>
