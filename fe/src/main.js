import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "@/assets/styles/fonts.css";
import "@/assets/styles/main.css";
import "@/assets/styles/tailwind.css";
import App from "@/app.vue";
import { routes } from "@/routes.js";

import { FwbAlert } from "flowbite-vue";
import { FwbCard } from "flowbite-vue";
import { FwbToggle } from "flowbite-vue";
import { FwbInput } from "flowbite-vue";
import { FwbTextarea } from "flowbite-vue";
import { FwbTab, FwbTabs } from "flowbite-vue";
import { FwbButton } from "flowbite-vue";

import "../node_modules/flowbite-vue/dist/index.css";

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PUBLIC_PATH),
  routes,
});

const app = createApp(App);

app.config.globalProperties.$appName = "Bracket Rat";
app.config.globalProperties.$teamPlayer = "Player"; //"team" or "player" ?

app.component("Card", FwbCard);
app.component("Toggle", FwbToggle);
app.component("Input", FwbInput);
app.component("Textarea", FwbTextarea);
app.component("Alert", FwbAlert);
app.component("Tab", FwbTab);
app.component("Tabs", FwbTabs);
app.component("FButton", FwbButton);

app.use(router);
app.mount("#app");
