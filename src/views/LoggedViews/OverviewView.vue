<script setup lang="ts">
import {
  NSpace,
  NIcon,
  NStatistic,
  NNumberAnimation,
  type NumberAnimationInst,
} from "naive-ui";
import { ShiftsOpen24Regular } from "@vicons/fluent";
import { onMounted, ref } from "vue";
import { getOverviewInfo } from "@/utils/api";

interface overviewInfo {
  totalSurvey: number;
  submitCount: number;
  activeSurvey: number;
}

const total = ref(0);
const submit = ref(0);
const active = ref(0);
const numberAnimationInstRef = ref<NumberAnimationInst | null>(null);

onMounted(() => {
  displayData();
});

function displayData() {
  getOverviewInfo()
    .then((response) => {
      const { data } = response;
      const res = data;
      const overview = res.data as overviewInfo;
      if (res.code === 200) {
        total.value = overview.totalSurvey;
        active.value = overview.activeSurvey;
        submit.value = overview.submitCount;
      }
    })
    .finally(() => {
      numberAnimationInstRef.value?.play();
    });
}
</script>

<template>
  <NSpace vertical>
    <NStatistic label="进行中的问卷" :value="active">
      <template #prefix>
        <NIcon>
          <ShiftsOpen24Regular />
        </NIcon>
      </template>
      <template #suffix> / {{ total }} </template>
    </NStatistic>
    <NStatistic label="提交了回答数量" tabular-nums>
      <NNumberAnimation
        ref="numberAnimationInstRef"
        show-separator
        :from="0"
        :to="submit"
        :active="false"
      />
    </NStatistic>
  </NSpace>
</template>
