import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import http from "./http";

const app = createApp(App);
app.use(store);
app.use(router);
app.config.globalProperties.$http = http;
app.mount("#app");