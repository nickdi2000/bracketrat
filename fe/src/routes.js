import AuthLayout from "@/layouts/AuthLayout.vue";
import Index from "@/pages/index.vue";
import Login from "@/pages/login.vue";
import Players from "@/pages/players.vue";
import Options from "@/pages/options.vue";
import NotFound from "@/pages/not-found.vue";
import Profile from "@/pages/profile.vue";
import Brackets from "@/pages/brackets.vue";
import DashLayout from "./layouts/DashLayout.vue";

//form
import BracketForm from "@/components/forms/BracketForm.vue";

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
        component: BracketForm,
      },
      {
        path: "/brackets/edit/:id?",
        name: "Edit Bracket",
        component: BracketForm,
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
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
