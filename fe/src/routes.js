import AuthLayout from "@/layouts/AuthLayout.vue";
import Index from "@/pages/index.vue";
import Login from "@/pages/login.vue";
import Players from "@/pages/players.vue";
import Options from "@/pages/options.vue";
import NotFound from "@/pages/not-found.vue";
import Profile from "@/pages/profile.vue";
import Brackets from "@/pages/brackets.vue";
import DashLayout from "./layouts/DashLayout.vue";
import BracketEdit from "@/pages/bracket.vue";
import Landing from "@/pages/landing.vue";
import Home from "@/pages/home.vue";
import Contact from "@/pages/contact.vue";

export const routes = [
  {
    path: "/",
    component: DashLayout,
    children: [
      { path: "", name: "Bracket", component: Index },
      { path: "/dashboard", name: "Dashboard", component: Index },
      { path: "/players", name: "Players", component: Players },
      { path: "/options", name: "Options & Config", component: Options },
      { path: "/profile", name: "My Profile", component: Profile },
      {
        path: "/brackets",
        name: "Brackets",
        component: Brackets,
      },
      {
        path: "/brackets/create",
        name: "Create Bracket",
        component: BracketEdit,
      },
      {
        path: "/brackets/edit/:id?",
        name: "Edit Bracket",
        component: BracketEdit,
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      { path: "/home", name: "home", component: Home },
      { path: "/contact/:flag?", name: "contact", component: Contact },
      { path: "/landing", name: "landing", component: Landing },
      { path: "/login", name: "login", component: Login },

      {
        path: "/register",
        registering: true,
        name: "register",
        component: Login,
      },
    ],
  },
  {
    path: "/:path(.*)",
    component: NotFound,
  },
];

export default routes;
