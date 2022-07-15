<script setup lang="ts">
import { NResult } from "naive-ui";
</script>

<template>
  <NResult class="center" status="success" title="恭喜！提交成功" />
</template>

<style>
.center {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}
</style>
