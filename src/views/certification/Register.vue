<template>
  <div class="box">
    <!-- navbar组件 -->
    <nav-bar>
      <template v-slot:left>
        <!-- 图标 -->
        <van-icon name="arrow-left" />
      </template>
      <template v-slot:center>
        <div class="title">注册</div>
      </template>
      <template v-slot:right>
        <!-- 图标 -->
        <van-icon name="ellipsis" />
      </template>
    </nav-bar>
    <!-- 注册框 -->
    <div class="register" ref="registerBox">
      <!--  表单 -->
      <van-form @submit="onSubmit" label-width="80px">
        <van-field
          @focus="inpFocus"
          @blur="inpBlur"
          class="inputSubmit"
          clearable
          v-model="userInfo.name"
          name="用户名"
          label="用户名："
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '用户名不能为空' }]"
        />
        <van-field
          @focus="inpFocus"
          @blur="inpBlur"
          class="inputSubmit"
          clearable
          v-model="userInfo.email"
          name="邮箱"
          type="email"
          label="邮箱："
          placeholder="请输入邮箱"
          :rules="[{ required: true, message: '邮箱不能为空' }]"
        />
        <van-field
          @focus="inpFocus"
          @blur="inpBlur"
          class="inputSubmit"
          clearable
          v-model="userInfo.password"
          type="password"
          name="密码"
          label="密码："
          placeholder="密码"
          :rules="[{ required: true, message: '密码不能为空' }]"
        />
        <van-field
          @focus="inpFocus"
          @blur="inpBlur"
          class="inputSubmit"
          clearable
          v-model="userInfo.password_confirmation"
          type="password"
          name="确认密码"
          label="确认密码："
          placeholder="请输入确认密码"
          :rules="[
            {
              validator,
              message: '两次密码不一致',
            },
          ]"
        />
        <div class="hrefPath">
          已经有账号?<a @click="$router.push('/login')">立即登录</a>
        </div>
        <div class="registerBtn">
          <input type="submit" value="注册" />
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
          <i class="iconfont icon-qq"></i>
          <i class="iconfont icon-weixin"></i>
          <i class="iconfont icon-github"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, reactive, getCurrentInstance } from "vue";
// 导入api
import { register } from "@/network/certification";

/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
/* 导入路由 */
import { useRouter } from "vue-router";

export default {
  name: "Register",
  setup() {
    // 用户数据
    const userInfo = reactive({
      name: "理解为认为",
      email: "2426091982@qq.com",
      password: "123123123123",
      password_confirmation: "123123123123",
    });
    // 获取ctx
    const { ctx }: any = getCurrentInstance();
    // 获取路由
    const router = useRouter();
    // 表单元素
    const registerBox = ref(null);
    // 校验密码跟确认密码一致
    const validator = (val: string) => {
      if (userInfo.password.length === 0) {
        return false;
      }
      return val === userInfo.password;
    };
    // 验证
    const onSubmit = (values: any) => {
      console.log("submit", values);
      // 注册
      register({
        params: userInfo,
      })
        .then((res: any) => {
          ctx.$toast("注册成功!");
          router.replace("/login");
        })
        .catch((err) => {
          // 只有邮箱重复才会报错
          ctx.$toast("邮箱已经存在");
        });
    };
    // 表单获取焦点
    const inpFocus = () => {
      // 设置表单高度,过渡效果
      (registerBox.value as any).style.height = "500px";
    };
    // 表单失去焦点,过渡效果
    const inpBlur = () => {
      // 设置表单高度
      (registerBox.value as any).style.height = "370px";
    };

    return {
      userInfo,
      onSubmit,
      validator,
      inpFocus,
      inpBlur,
      registerBox,
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
  // background-color: #f8f8f8;
  background-image: url("https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1873472379,3024482414&fm=26&gp=0.jpg");
  background-size: cover;
  position: relative;
  .register {
    padding: 20px 10px;
    background-color: #fff;
    width: 100%;
    position: fixed;
    bottom: 0;
    border-radius: 20px;
    transition: all 0.5s;
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
    .registerBtn {
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
        font-size: 35px
      }

      i.iconfont.icon-github {
        font-size: 35px;
        color: #000;
      }
    }
  }
}
</style>
