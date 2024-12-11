import { createApp } from "vue";
import App from "./App.vue";
import router from "../src/router/index.js";
import "./assets/main.css";
import { createPinia } from "pinia";
import CoreuiVue from "@coreui/vue";



createApp(App).use(router).use(createPinia()).use(CoreuiVue).mount("#app");
