<script setup lang="ts">
import { NIcon, NDropdown, NH2 } from "naive-ui";
import { TITLE } from "@/config";
import { h, type Component } from "vue";
import { LogOutOutline as LogoutIcon, ChevronDown } from "@vicons/ionicons5";
import { useStatusStore } from "@/stores/status";
import { useRouter } from "vue-router";

const router = useRouter();
const status = useStatusStore();
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function handleSelect(key: string | number) {
  if (key === "logout") {
    status.$reset();
    window.$message.info("已退出登录");
    router.push("/login");
  }
}

const options = [
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(LogoutIcon),
  },
];
</script>

<template>
  <div style="height: 100%; display: flex; align-items: center">
    <div style="flex: 1; margin-left: 36px; vertical-align: middle">
      <RouterLink to="/">
        <!-- TODO: 图标与标题水平居中 -->
        <NIcon size="38" style="top: 15px">
          <img src="@/assets/logo.svg" style="height: 100%" />
        </NIcon>
      </RouterLink>
      <RouterLink to="/">
        <NH2 style="margin-left: 10px; display: inline-block">{{ TITLE }}</NH2>
      </RouterLink>
    </div>
    <NDropdown :options="options" placement="bottom-end" @select="handleSelect">
      <!-- TODO: 人名与箭头水平对齐 -->
      <div style="margin-right: 30px">
        <span style="line-height: 100%; font-size: 16px">
          {{ status.userInfo.name }}
        </span>
        <NIcon
          :component="ChevronDown"
          size="22px"
          style="margin-left: 2px; vertical-align: middle"
        />
      </div>
    </NDropdown>
  </div>
</template>
