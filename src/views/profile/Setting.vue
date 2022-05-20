<template>
  <div class="box">
    <!-- navbar组件 -->
    <nav-bar>
      <template v-slot:left>
        <!-- 图标 -->
        <van-icon name="arrow-left" />
      </template>
      <template v-slot:center>
        <div class="title">账号管理</div>
      </template>
      <template v-slot:right>
        <!-- 图标 -->
        <van-icon name="ellipsis" />
      </template>
    </nav-bar>
    <!-- 用户信息 -->
    <div class="userInfo">
      <!-- 头像 -->
      <div class="avatar">
        <van-image
          width="100%"
          height="375"
          lazy-load
          fit="cover"
          :src="userInfo.avatar_url"
        >
          <!-- <template v-slot:error>加载失败</template> -->
        </van-image>
      </div>
      <div class="form">
        <van-cell-group>
          <van-field
            v-model="userInfo.name"
            label="昵  称"
            placeholder="请输入昵称"
          />
        </van-cell-group>
        <van-cell-group>
          <van-field
            v-model="userInfo.avatar_url"
            rows="1"
            autosize
            label="头像路径"
            type="textarea"
            placeholder="请输入头像路径"
          />
        </van-cell-group>
        <van-button @click="saveInfo" type="danger" size="large" round
          >保存信息</van-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
/* 导入更新用户api */
import { getUserInfo, updateUserInfo, updateAvatar } from "@/network/user";
import { onMounted, reactive, ref, getCurrentInstance } from "vue";

export default {
  name: "setting",
  setup() {
    // 用户信息
    let userInfo = ref({
      avatar_url: "",
      name: "",
    });

    const { ctx }: any = getCurrentInstance();

    // 生命周期函数
    onMounted(() => {
      // 获取用户详情
      getUserInfo().then((res: any) => {
        userInfo.value = res;
      });
    });

    // 保存用户信息
    const saveInfo = () => {
      // 更新头像;
      // updateAvatar(userInfo.value.avatar_url).then((res) => {
      //   console.log(res);
      // });
      ctx.$toast({message:"更新头像功能接口更新中...", position: 'top'});
      // 更新昵称
      updateUserInfo(userInfo.value.name).then((res: any) => {
        console.log(res);

        
      });
    };

    return {
      userInfo,
      saveInfo,
    };
  },
  components: {
    NavBar,
  },
};
</script>

<style lang="less" scoped>
.userInfo {
  position: relative;
  height: calc(100vh - 60px);
  // background-color: pink;
  .avatar {
    .van-image {
    }
  }

  .form {
    width: 100vw;
    height: 55%;
    z-index: 999999;
    position: absolute;
    left: 0;
    bottom: 0;
    border-radius: 15px 15px 0px 0px;
    background-color: #fff;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .van-cell-group {
      .van-field {
      }
    }

    .van-button {
      border-radius: 10px !important;
    }
  }
}
</style>
