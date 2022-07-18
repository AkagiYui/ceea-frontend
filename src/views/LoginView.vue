<script setup lang="ts">
import { TITLE } from "@/config";
import { ref } from "vue";
import type { FormInst } from "naive-ui";
import { NCard, NButton, NInput, NForm, NFormItemRow, NSpace } from "naive-ui";
import { useStatusStore } from "@/stores/status";
import { useRouter, useRoute } from "vue-router";
import { getToken, getUserInfo } from "@/utils/api";
interface UserInfo {
  name: string;
}

const router = useRouter();
const route = useRoute();
const redirect = route.query.redirect as string;
const status = useStatusStore();
const logged = status.logged;
const formRef = ref<FormInst | null>(null);
const loadingRef = ref(false);
const userValue = ref({
  username: "ddi",
  password: "1050314133",
});
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "长度在 3 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 1,
      max: 20,
      message: "长度在 1 到 20 个字符",
      trigger: "blur",
    },
  ],
};

function handleLogin(e: MouseEvent) {
  loadingRef.value = true;
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      getToken(userValue.value)
        .then((response) => {
          const { data } = response;
          const res = data;
          if (res.code !== 200) {
            window.$message.error(res.msg);
            loadingRef.value = false;
          } else {
            window.$message.success("登录成功");
            status.setLoggingStatus(true, res.data as string);
            getUserInfo()
              .then((response) => {
                const { data } = response;
                const res = data;
                if (res.code === 200) {
                  status.setUserInfo(res.data as UserInfo);
                  if (redirect) {
                    router.push(redirect);
                  } else {
                    router.push("/");
                  }
                } else {
                  window.$message.error("用户信息获取失败\n" + res);
                  loadingRef.value = false;
                }
              })
              .catch(() => {
                loadingRef.value = false;
              });
          }
        })
        .catch(() => {
          loadingRef.value = false;
        });
    } else {
      loadingRef.value = false;
    }
  });
}
</script>

<template>
  <div class="background"></div>
  <NCard class="box">
    <h1 style="text-align: center; margin-top: 2px">{{ TITLE }}</h1>
    <NForm :model="userValue" :rules="rules" ref="formRef" :show-label="false">
      <NFormItemRow path="username">
        <NInput placeholder="请输入用户名" v-model:value="userValue.username" />
      </NFormItemRow>
      <NFormItemRow path="password">
        <NInput
          placeholder="请输入密码"
          v-model:value="userValue.password"
          type="password"
          show-password-on="click"
        />
      </NFormItemRow>
    </NForm>
    <NSpace vertical style="text-align: center">
      <NButton
        type="primary"
        :loading="loadingRef"
        :disabled="loadingRef"
        block
        secondary
        strong
        @click="handleLogin"
      >
        登录
      </NButton>
      <RouterLink v-if="logged" to="/">回到主页</RouterLink>
    </NSpace>
  </NCard>
</template>

<style scoped>
@media only screen and (min-width: 550px) {
  .background {
    filter: brightness(0.8);
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: url("https://source.yby.zone/upload/images/1655001503_P15Qqvxb1oe.jpg")
      center no-repeat;
    background-size: cover;
  }

  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 400px;
    z-index: 9999;
  }
}

@media only screen and (max-width: 550px) {
  .box {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    border: 0;
  }
}
</style>
