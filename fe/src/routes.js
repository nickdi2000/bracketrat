import AuthLayout from "@/layouts/AuthLayout.vue";
import Index from "@/pages/index.vue";
import Login from "@/pages/login.vue";
import Players from "@/pages/players.vue";
import Options from "@/pages/options.vue";
import NotFound from "@/pages/not-found.vue";
import DashLayout from "./layouts/DashLayout.vue";

export const routes = [
  {
    path: "/",
    component: DashLayout,
    children: [
      { path: "", name: "Bracket", component: Index },
      { path: "/players", name: "Team / Players", component: Players },
      { path: "/options", name: "Options & Config", component: Options },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [{ path: "/login", component: Login }],
  },
  {
    path: "/:path(.*)",
    component: NotFound,
  },
];

export default routes;
