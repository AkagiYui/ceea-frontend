<script setup lang="ts">
import { NResult, NButton } from "naive-ui";
import { useRouter } from "vue-router";

const router = useRouter();

function handleClick() {
  router.push("/");
}
</script>

<template>
  <NResult
    class="center"
    status="error"
    title="404 资源不存在"
    description="需要帮助请联系管理员"
  >
    <template #footer>
      <NButton @click="handleClick">回到主页</NButton>
    </template>
  </NResult>
</template>

<style>
.center {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}
</style>
