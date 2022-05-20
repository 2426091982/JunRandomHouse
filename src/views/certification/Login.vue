<template>
  <div class="box">
    <!-- navbar组件 -->
    <nav-bar>
      <template v-slot:left>
        <!-- 图标 -->
        <van-icon name="arrow-left" />
      </template>
      <template v-slot:center>
        <div class="title">登录</div>
      </template>
      <template v-slot:right>
        <!-- 图标 -->
        <van-icon name="ellipsis" />
      </template>
    </nav-bar>
    <!-- 注册框 -->
    <div class="login" ref="loginBox" :style="{ height }">
      <!--  表单 -->
      <van-form @submit="onSubmit" label-width="60px">
        <van-field
          @focus="inpFocus"
          @blur="inpBlur"
          class="inputSubmit"
          clearable
          type="email"
          v-model="userInfo.email"
          name="邮箱"
          label="邮箱："
          placeholder="请输入邮箱"
          :rules="[{ required: true, message: '邮箱不能为空' }]"
        />

        <van-field
          class="inputSubmit"
          @focus="inpFocus"
          @blur="inpBlur"
          clearable
          v-model="userInfo.password"
          type="password"
          name="密码"
          label="密码："
          placeholder="密码"
          :rules="[{ required: true, message: '密码不能为空' }]"
        />
        <div class="hrefPath">
          还没有账号?<a @click="$router.push('/register')">立即注册</a>
        </div>
        <div class="loginBtn">
          <input type="submit" value="登录" />
        </div>
      </van-form>
      <!-- 其他登录方式 -->
      <div class="otherWay">
        <van-divider
          :style="{
            color: '#f88358',
            borderColor: '#f88358',
            padding: '0 16px',
          }"
        >
          其他登录方式
        </van-divider>
        <div class="loginWay">
          <i @click="loginWay" class="iconfont icon-qq"></i>
          <i @click="loginWay" class="iconfont icon-weixin"></i>
          <i @click="loginWay" class="iconfont icon-github"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
// 登录api
import { login } from "@/network/certification";
// vuex
import { useStore } from "vuex";

/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
export default {
  name: "Login",
  setup() {
    // 用户数据
    const userInfo = reactive({
      email: "030604@qq.com",
      password: "123456",
    });
    // 路由
    const router = useRouter();
    // 表单元素
    const loginBox = ref(null);
    // 获取ctx
    const { ctx }: any = getCurrentInstance();
    // vuex Store
    const store = useStore();
    // 验证
    const onSubmit = (values: any) => {
      // 登录
      login({
        params: userInfo,
      })
        .then((res: any) => {
          // 将返回的token保存到本地
          localStorage.setItem("token", res.access_token);
          // 保存到vuex
          store.commit("setIsLogin", true);
          
          ctx.$toast("登录成功");
          // 跳转路由到首页
          router.push("/home");
        })
        .catch((err) => {
          console.log(err.response);
          ctx.$toast("登录失败, 邮箱或者密码错误");
        });
    };

    // 表单获取焦点
    const inpFocus = () => {
      // 设置表单高度,过渡效果
      (loginBox.value as any).style.height = "350px";
    };
    // 表单失去焦点
    const inpBlur = () => {
      // 设置表单高度,过渡效果
      (loginBox.value as any).style.height = "235px";
    };
    const loginWay = () => {
      ctx.$toast("该功能正在开发中");
    };
    return {
      userInfo,
      onSubmit,
      inpFocus,
      inpBlur,
      loginBox,
      loginWay,
    };
  },
  components: {
    NavBar,
  },
};
</script>

<style lang="less" scoped>
.box {
  height: calc(100vh - 60px);
  background-image: url("https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1873472379,3024482414&fm=26&gp=0.jpg");
  background-size: cover;
  position: relative;
  .login {
    padding: 20px 10px;
    background-color: #fff;
    width: 100%;
    position: fixed;
    bottom: 0;
    border-radius: 20px;
    transition: all 0.5s ease-in-out;
    height: 150px;
    box-shadow: 2px 2px 20px 2px rgb(0 0 0 / 30%);
    .inputSubmit {
      height: 68px;
    }
    .hrefPath {
      font-size: 12px;
      text-align: right;
      margin-bottom: 10px;
      a {
        color: var(--color-high);
      }
    }
    .loginBtn {
      text-align: center;
      input {
        border: none;
        outline: none;
        padding: 10px 0;
        width: 200px;
        background-color: var(--color-high);
        color: #fff;
        border-radius: 10px;
      }
    }
    .loginWay {
      display: flex;
      justify-content: space-around;
      align-items: center;
      i.iconfont.icon-qq {
        font-size: 35px;
        color: #1bc1fa;
      }

      i.iconfont.icon-weixin {
        color: #08ba06;
        font-size: 35px;
      }

      i.iconfont.icon-github {
        font-size: 35px;
        color: #000;
      }
    }
  }
}
</style>
