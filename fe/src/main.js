import { createApp } from "vue";
import "@/assets/styles/fonts.css";
import "@/assets/styles/main.css";
import "@/assets/styles/tailwind.css";
import App from "@/app.vue";
//import { routes } from "@/router.js";
import api from "./api";
import ToastPlugin from "vue-toast-notification";
import { FwbAlert } from "flowbite-vue";
import { FwbCard } from "flowbite-vue";
import { FwbToggle } from "flowbite-vue";
import { FwbInput } from "flowbite-vue";
import { FwbTextarea } from "flowbite-vue";
import { FwbTab, FwbTabs } from "flowbite-vue";
import { FwbButton } from "flowbite-vue";
import { FwbSpinner } from "flowbite-vue";
import { FwbSelect } from "flowbite-vue";

import Error from "@/components/ui/Error.vue"; // Adjust the path as necessary

import "../node_modules/flowbite-vue/dist/index.css";
import "vue-toast-notification/dist/theme-bootstrap.css";

import router from "./router";

import Loader from "@/components/Loader.vue";
import ProgressBar from "@/components/ProgressBar.vue";

import eventBus from "@/plugins/eventBus";

import AddPlayerModal from "@/modals/AddPlayerModal.vue";

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
  ArrowUturnRightIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  PlusCircleIcon,
  UserCircleIcon,
  UserGroupIcon,
  HomeIcon,
  UsersIcon,
  ArrowPathIcon,
  TableCellsIcon,
  BoltIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrophyIcon,
  QrCodeIcon,
  ListBulletIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/solid";

import piniaPlugin from "./plugins/pinia";
import { authStore } from "./store/auth";
import openDialog from "@/services/dialog.service";
import bottomAlert from "./services/bottom.alert.service";
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);
app.use(vue3GoogleLogin, {
  clientId:
    "59253511509-r5uob532ime0c9jvmoq5m8ob6tajim2l.apps.googleusercontent.com",
});

app.component("AddPlayerModal", AddPlayerModal);

app.config.globalProperties.$showAddPlayerModal = (data = {}) => {
  eventBus.emit("show-add-player-modal", data);
};

app.use(piniaPlugin);
app.config.globalProperties.$appName = "Bracket Force";
app.config.globalProperties.$baseUrl = "BracketForce.com";
app.config.globalProperties.$api = api;
app.config.globalProperties.$store = authStore();
app.config.globalProperties.$openDialog = openDialog;
app.config.globalProperties.$bottomAlert = bottomAlert;
app.config.globalProperties.$isLocal = import.meta.env.VITE_ENV === "local";
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
app.component("QuestionMarkCircleIcon", QuestionMarkCircleIcon);
app.component("PlusCircleIcon", PlusCircleIcon);
app.component("UserCircleIcon", UserCircleIcon);
app.component("UserGroupIcon", UserGroupIcon);
app.component("UsersIcon", UsersIcon);
app.component("ListBulletIcon", ListBulletIcon);
app.component("Error", Error);
app.component("HomeIcon", HomeIcon);

//custom

app.component("Loader", Loader);
app.component("ProgressBar", ProgressBar);

//icons
app.component("TableCellsIcon", TableCellsIcon);
app.component("BoltIcon", BoltIcon);
app.component("LockClosedIcon", LockClosedIcon);
app.component("LockOpenIcon", LockOpenIcon);
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
app.component("ArrowUturnRightIcon", ArrowUturnRightIcon);
app.component("ArrowUturnLeftIcon", ArrowUturnLeftIcon);
app.component("PencilSquareIcon", PencilSquareIcon);
app.component("ExclamationTriangleIcon", ExclamationTriangleIcon);
app.component("ArrowPathIcon", ArrowPathIcon);
app.component("QrCodeIcon", QrCodeIcon);
app.component("TrophyIcon", TrophyIcon);
app.component("Cog6ToothIcon", Cog6ToothIcon);

app.use(router);

app.use(ToastPlugin, {
  // One of the options
  position: "top",
});

app.mount("#app");

//GOOGLE SCRIPTS

if (import.meta.env.VITE_ENV != "local") {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=G-GMVGD9DMRK`;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "G-GMVGD9DMRK");
  };

  const script2 = document.createElement("script");
  script2.async = true;
  script2.src = `https://www.googletagmanager.com/gtag/js?id=AW-16641979521`;
  document.head.appendChild(script);

  script2.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "AW-16641979521");
  };
}
