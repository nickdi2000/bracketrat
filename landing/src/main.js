import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

import "aos/dist/aos.css";
import "./css/style.css";

const app = createApp(App);

//shortcut for registerLink
app.config.globalProperties.$registerLink = () => {
	let queryString = window.location.search;
	return "https://bracketforce.com/register" + queryString;
};

app.config.globalProperties.$contactUsLink = () => {
	let queryString = window.location.search;
	return "https://bracketforce.com/contact" + queryString;
};

app.use(router);
app.mount("#app");
