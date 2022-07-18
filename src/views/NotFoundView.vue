<script setup lang="ts">
import { NResult, NButton, NCard } from "naive-ui";
import { useRouter } from "vue-router";

const router = useRouter();

function handleClick() {
  router.push("/");
}
</script>

<template>
  <NCard style="height: 100vh">
    <NResult
      class="center"
      status="error"
      title="404 资源不存在"
      size="huge"
      description="需要帮助请联系管理员"
    >
      <template #footer>
        <NButton @click="handleClick">回到首页</NButton>
      </template>
    </NResult>
  </NCard>
</template>

<style>
.center {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}
</style>
