import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "@/assets/styles/fonts.css";
import "@/assets/styles/main.css";
import "@/assets/styles/tailwind.css";
import App from "@/app.vue";
import { routes } from "@/routes.js";
import api from "./api";
import ToastPlugin from "vue-toast-notification";
import { createPinia } from "pinia";
import { FwbAlert } from "flowbite-vue";
import { FwbCard } from "flowbite-vue";
import { FwbToggle } from "flowbite-vue";
import { FwbInput } from "flowbite-vue";
import { FwbTextarea } from "flowbite-vue";
import { FwbTab, FwbTabs } from "flowbite-vue";
import { FwbButton } from "flowbite-vue";
import { FwbSpinner } from "flowbite-vue";
import { FwbSelect } from "flowbite-vue";

import "../node_modules/flowbite-vue/dist/index.css";
import "vue-toast-notification/dist/theme-bootstrap.css";

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PUBLIC_PATH),
  routes,
});

import Loader from "@/components/Loader.vue";
import ProgressBar from "@/components/ProgressBar.vue";

import {
  TrashIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  HandThumbDownIcon,
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
  ArrowLongRightIcon,
  ArrowLongLeftIcon,
  ArrowUturnDownIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/solid";

import piniaPlugin from "./plugins/pinia";
import { authStore } from "./store/auth";

import openDialog from "@/services/dialog.service";
import bottomAlert from "./services/bottom.alert.service";

const app = createApp(App);
app.use(piniaPlugin);
app.config.globalProperties.$appName = "Bracket Rat";
app.config.globalProperties.$api = api;
app.config.globalProperties.$store = authStore();
app.config.globalProperties.$openDialog = openDialog;
app.config.globalProperties.$bottomAlert = bottomAlert;

app.config.globalProperties.$teamPlayer =
  authStore().teamPlayer ?? "Team/Player";

app.component("Card", FwbCard);
app.component("Toggle", FwbToggle);
app.component("Input", FwbInput);
app.component("Textarea", FwbTextarea);
app.component("Alert", FwbAlert);
app.component("Tab", FwbTab);
app.component("Tabs", FwbTabs);
app.component("FButton", FwbButton);
app.component("Spinner", FwbSpinner);
app.component("Select", FwbSelect);

//custom
app.component("Loader", Loader);
app.component("ProgressBar", ProgressBar);

//icons
app.component("TrashIcon", TrashIcon);
app.component("PlayCircleIcon", PlayCircleIcon);
app.component("CheckCircleIcon", CheckCircleIcon);
app.component("BackwardsIcon", ArrowLeftStartOnRectangleIcon);
app.component("HandThumbDownIcon", HandThumbDownIcon);
app.component("ArrowRightCircleIcon", ArrowRightCircleIcon);
app.component("ArrowLongRightIcon", ArrowLongRightIcon);
app.component("ArrowLeftCircleIcon", ArrowLeftCircleIcon);
app.component("ArrowLongLeftIcon", ArrowLongLeftIcon);
app.component("ArrowUturnDownIcon", ArrowUturnDownIcon);
app.component("PencilSquareIcon", PencilSquareIcon);

app.use(router);

app.use(ToastPlugin, {
  // One of the options
  position: "top",
});

app.mount("#app");
