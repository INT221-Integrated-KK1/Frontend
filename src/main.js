import { createApp } from "vue";
import App from "./App.vue";
import router from "../src/router/index.js";
import "./assets/main.css";
import { createPinia } from "pinia";

createApp(App).use(router).use(createPinia()).mount("#app");
