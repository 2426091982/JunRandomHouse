<template>
  <div class="box">
    <!-- navbar组件 -->
    <nav-bar>
      <template v-slot:left>
        <!-- 图标 -->
        <van-icon name="arrow-left" />
      </template>
      <template v-slot:center>
        <div class="title">添加地址</div>
      </template>
      <template v-slot:right>
        <!-- 图标 -->
        <van-icon name="ellipsis" />
      </template>
    </nav-bar>

    <!-- 编辑地址 -->
    <van-address-edit
      :area-list="areaList"
      show-delete
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['选择省', '市', '区']"
      @save="onSave"
      @delete="onDelete"
      @change-detail="onChangeDetail"
      :address-info="AddressInfo"
    />
  </div>
</template>

<script lang="ts">
/* 导入NavBar组件 */
import NavBar from "components/common/navbar/NavBar.vue";
/* 导入地区列表 */
import areaList from "@/utils/areaList";
import { ref, getCurrentInstance, reactive, onMounted, onActivated } from "vue";
// 路由
import { useRouter, useRoute } from "vue-router";
// 导入地址api
import {
  addAddress,
  deleteAddress,
  updateAddress,
  getAddressDetail,
} from "@/network/address";
import { login } from "../../../network/certification";
export default {
  name: "addAddress",
  setup() {
    // ctx
    const { ctx }: any = getCurrentInstance();
    const searchResult: any = ref([]);
    // 获取路由
    const router = useRouter();
    const route = useRoute();
    // 收货人信息初始值
    let AddressInfo: any = reactive({
      name: "",
      tel: "",
      province: "",
      city: "",
      county: "",
      // 默认地址
      addressDetail: "",
      isDefault: false,

    });

    // 页面初始化
    const init = () => {
      if (route.query.type === "edit") {
        getAddressDetail(route.query.addressId).then((res: any) => {
          // console.log(res);

          AddressInfo.name = res.name;
          AddressInfo.tel = res.phone;
          AddressInfo.province = res.province;
          AddressInfo.city = res.city;
          AddressInfo.county = res.county;
          AddressInfo.addressDetail = res.address;
          // AddressInfo.areaCode = 120101;
          AddressInfo.isDefault = !!res.is_default;
        });
      }
    };

    onMounted(() => {
      init();
    });

    onActivated(() => {
      init();
    });

    // 保存地址
    const onSave = (content: any) => {
      console.log(content);

      // 地址参数
      const params = {
        // 姓名
        name: content.name,
        // 电话
        phone: content.tel,
        // 省
        province: content.province,
        // 市
        city: content.city,
        // 区
        county: content.county,
        // 详细地址
        address: content.addressDetail,
        // 是否为默认地址
        is_default: content.isDefault ? 1 : null,
      };
      // 判断是修改还是添加
      if (route.query.type === "add") {
        // 添加地址
        addAddress(params).then((res: any) => {
          ctx.$toast("保存成功");
          // 返回地址列表
          router.go(-2);
        });
      } else if (route.query.type === "edit") {
        // 修改地址
        updateAddress(route.query.addressId, params).then((res: any) => {
          // 返回地址列表
          router.go(-2);
        });
      }
    };
    // 取消当前地址
    const onDelete = () => {
      if (route.query.type === "add") {
        // 返回地址列表
        router.replace("/addressList");
      } else if (route.query.type === "edit") {
        deleteAddress(route.query.addressId).then((res: any) => {
          ctx.$toast("删除地址成功");
          // 返回地址列表
          router.replace("/addressList");
        });
      }
    };
    // 地址
    const onChangeDetail = (val: any) => {
      if (val) {
        searchResult.value = [
          {
            name: "黄龙万科中心",
            address: "杭州市西湖区",
          },
        ];
      } else {
        searchResult.value = [];
      }
    };

    return {
      areaList,
      onSave,
      onDelete,
      searchResult,
      onChangeDetail,
      AddressInfo,
    };
  },
  components: {
    NavBar,
  },
};
</script>

<style lang="less" scoped></style>
