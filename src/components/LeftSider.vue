<script setup lang="ts">
import { NMenu, NIcon } from "naive-ui";
import { h, type Component } from "vue";
import type { MenuOption } from "naive-ui";
import { RouterLink, useRoute } from "vue-router";
import {
  // ClipboardDataBar24Regular,
  AppsList24Regular,
  Settings24Regular,
  VideoPersonSparkle24Regular,
  Home24Regular,
  Folder24Regular,
  PersonEdit24Regular,
  ShareScreenPersonP24Regular,
} from "@vicons/fluent";
const route = useRoute();
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "overview",
            params: {
              lang: "zh-CN",
            },
          },
        },
        { default: () => "总览" }
      ),
    key: "overview",
    icon: renderIcon(Home24Regular),
  },
  {
    key: "divider-1",
    type: "divider",
    props: {
      style: {
        marginLeft: "32px",
      },
    },
  },
  {
    label: "系统管理",
    key: "setting",
    icon: renderIcon(Settings24Regular),
    children: [
      {
        label: '角色管理',
        key: 'rat',
        icon: renderIcon(ShareScreenPersonP24Regular),
      },
      {
        label: '用户管理',
        key: 'rat',
        icon: renderIcon(PersonEdit24Regular),
      },
      {
        label: '文件管理',
        key: 'rat',
        icon: renderIcon(Folder24Regular),
      },
    ]
  },
  {
    label: "培养方案管理",
    key: "setting",
    icon: renderIcon(Settings24Regular),
  },
  {
    label: "课程教学过程管理",
    key: "setting",
    icon: renderIcon(Settings24Regular),
  },
  {
    label: "课程目标达成度",
    key: "setting",
    icon: renderIcon(Settings24Regular),
  },
  {
    label: "毕业要求达成度",
    key: "setting",
    icon: renderIcon(Settings24Regular),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "survey",
            params: {
              lang: "zh-CN",
            },
          },
        },
        { default: () => "调查问卷" }
      ),
    key: "survey",
    icon: renderIcon(AppsList24Regular),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "setting",
            params: {
              lang: "zh-CN",
            },
          },
        },
        { default: () => "个人信息" }
      ),
    key: "setting",
    icon: renderIcon(VideoPersonSparkle24Regular),
  },
];
</script>

<template>
  <NMenu
    :collapsed="props.collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
    style="min-height: 100%; padding-top: 5px"
    :value="(route.name as string)"
    :indent="20"
  />
</template>
