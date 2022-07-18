<script setup lang="ts">
import { NResult, NCard } from "naive-ui";
</script>

<template>
  <NCard style="height: 100vh">
    <NResult
      class="center"
      status="success"
      title="恭喜！提交成功"
      description="可以关闭页面了"
    />
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
