<template>
  <!-- navbar组件 -->
  <nav-bar>
    <template v-slot:left>
      <!-- 图标 -->
      <van-icon name="arrow-left" />
    </template>
    <template v-slot:center>
      <div class="title">地址管理</div>
    </template>
    <template v-slot:right>
      <!-- 图标 -->
      <van-icon name="ellipsis" />
    </template>
  </nav-bar>

  <div class="box">
    <Scroll ref="scroll">
      <div class="content">
        <!-- 地址列表 -->
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认地址"
          @add="onAdd"
          @edit="onEdit"
        />
      </div>
    </Scroll>
  </div>
</template>

<script lang="ts">
/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
// 导入滚动组件
import Scroll from "components/common/scroll/Scroll.vue";
import { ref, onMounted, onActivated, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
// 导入地址api
import { getAddressList } from "@/network/address";
export default {
  name: "addressList",
  setup() {
    // 选中的地址
    const chosenAddressId = ref("1");
    // 路由
    const router = useRouter();
    // 地址列表
    const list: any = ref([]);
    // ctx
    const { ctx }: any = getCurrentInstance();

    // 初始化
    const init = () => {
      // 获取地址
      getAddressList().then((res) => {
        // 如果没有数据
        if (res.data.length == 0) {
          list.value = [];
        }
        // 返回处理过的数据
        list.value = res.data.map((item: any) => {
          // 默认选中默认地址
          if (item.is_default) {
            chosenAddressId.value = item.id;
          }
          return {
            id: item.id,
            name: item.name,
            tel: item.phone,
            // 地址
            address: item.address,
            // 是否为默认地址
            isDefault: !!item.is_default,
          };
        });
        ctx.$refs.scroll.refresh();
      });
    };

    // 生命周期
    onMounted(() => {
      // 初始化
      init();
    });

    // 被缓存的时候
    onActivated(() => {
      // 初始化
      init();
    });

    // 新增地址
    const onAdd = () => {
      router.push({
        path: "/addressEdit",
        query: {
          type: "add",
        },
      });
    };
    // 修改地址
    const onEdit = (item: any, index: number) => {
      router.push({
        path: "/addressEdit",
        query: {
          type: "edit",
          // 地址id
          addressId: item.id,
        },
      });
    };

    return {
      list,
      onAdd,
      onEdit,
      chosenAddressId,
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
}
</style>
