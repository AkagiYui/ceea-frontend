import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import request from "@/utils/request";
import pinia from "./stores";

const app = createApp(App);

app.use(pinia);
app.use(router);
app.config.globalProperties.request = request;

app.mount("#app");
