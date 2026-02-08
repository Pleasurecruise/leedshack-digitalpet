// Ensure window.PIXI is set before any pixi-live2d-display usage
import "./utils/pixi-setup";

import { createPlugin } from "@tauri-store/pinia";
import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import { i18n } from "@/core/locales";
import router from "@/core/router";

import "virtual:uno.css";
import "@my-monorepo/ui/styles/globals.css";
import "./assets/css/variables.css";
import "./assets/css/global.scss";

const pinia = createPinia();
pinia.use(createPlugin({ saveOnChange: true }));

createApp(App).use(router).use(pinia).use(i18n).mount("#app");
