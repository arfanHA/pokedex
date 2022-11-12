import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import axios from "axios";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(store);
app.use(ElementPlusIconsVue);
app.mount("#app");

axios.defaults.baseURL = "https://pokeapi.co/api/v2";
