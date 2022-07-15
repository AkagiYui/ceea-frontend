<script setup lang="ts">
import { RouterView } from "vue-router";
import MessageApi from "@/components/MessageApi.vue";
import DialogApi from "@/components/DialogApi.vue";
import LoadingBarApi from "@/components/LoadingBarApi.vue";
import {
  NMessageProvider,
  NDialogProvider,
  NLoadingBarProvider,
  darkTheme,
  NConfigProvider,
} from "naive-ui";
import { useStatusStore } from "@/stores/status";
const status = useStatusStore();
</script>

<template>
  <NLoadingBarProvider>
    <LoadingBarApi />
  </NLoadingBarProvider>
  <NMessageProvider>
    <MessageApi />
  </NMessageProvider>
  <NDialogProvider>
    <DialogApi />
  </NDialogProvider>
  <NConfigProvider
    :theme="status.darkMode && status.logged ? darkTheme : null"
    inline-theme-disabled
  >
    <div id="app" style="height: 100vh">
      <RouterView />
    </div>
  </NConfigProvider>
</template>

<style></style>
