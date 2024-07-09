import AuthLayout from "@/layouts/AuthLayout.vue";
import Index from "@/pages/index.vue";
import Login from "@/pages/login.vue";
import Players from "@/pages/players.vue";
import Options from "@/pages/options.vue";
import Settings from "@/pages/settings.vue";
import NotFound from "@/pages/not-found.vue";
import Profile from "@/pages/profile.vue";
import Brackets from "@/pages/brackets.vue";
import DashLayout from "./layouts/DashLayout.vue";
import PublicLayout from "./layouts/PublicLayout.vue";
import BracketEdit from "@/pages/bracket.vue";
import Landing from "@/pages/landing.vue";
import Home from "@/pages/home.vue";
import Contact from "@/pages/contact.vue";
import Organization from "@/pages/organization.vue";
import PublicIndex from "@/pages/public/public-index.vue";

import { createRouter, createWebHistory } from "vue-router";

import { authStore } from "./store/auth";

const routes = [
  {
    path: "/",
    name: "Public",
    meta: { isPublic: true },
    component: PublicLayout,
    children: [{ path: "", name: "PublicIndex", component: PublicIndex }],
  },
  {
    path: "/auth",
    component: AuthLayout,
    meta: { isPublic: true },
    children: [
      {
        path: "/admin/home",
        name: "home",
        component: Home,
        meta: { isPublic: true },
      },

      {
        path: "/landing",
        name: "landing",
        component: Landing,
        meta: { isPublic: true },
      },
      {
        path: "/login",
        name: "login",
        component: Login,
        meta: { isPublic: true },
      },

      {
        path: "/register",
        meta: { isPublic: true },
        registering: true,
        name: "register",
        component: Login,
      },
    ],
  },
  {
    path: "/admin",
    component: DashLayout,
    children: [
      { path: "", name: "Bracket", component: Index },
      { path: "dashboard", name: "Dashboard", component: Index },
      { path: "org", name: "Organization", component: Organization },
      { path: "players/:page?", name: "Players", component: Players },
      { path: "settings", name: "Settings", component: Settings },
      { path: "profile", name: "My Profile", component: Profile },
      {
        path: "contact/:flag?",
        name: "contact",
        component: Contact,
      },
      {
        path: "brackets",
        name: "Brackets",
        component: Brackets,
      },
      {
        path: "brackets/create",
        name: "Create Bracket",
        component: BracketEdit,
      },
      {
        path: "brackets/edit/:id?",
        name: "Edit Bracket",
        component: BracketEdit,
      },
    ],
  },

  {
    path: "/:path(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

// const router = createRouter({
//   history: createWebHistory(import.meta.env.VITE_BASE_PUBLIC_PATH),
//   routes,
// });

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PUBLIC_PATH),
  mode: "history",
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const store = authStore();
  const isAuthenticated = store.check;

  const isPublicRoute = to.matched.some((record) => record.meta.isPublic);
  const defaultRoute = "/login";

  if (isPublicRoute && isAuthenticated) {
    next("/admin");
  } else if (!isPublicRoute && !isAuthenticated) {
    next(defaultRoute);
  } else {
    next();
  }
});

export default router;

//export default routes;

/*
const routes = [...authRoutes, ...guestRoutes];

const router = createRouter({
    history: createWebHistory('/'),
    mode: 'history',
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 };
    }
});

// navigation guard to check authentication status

router.beforeEach((to, from, next) => {
    const store = authStore();
    const isAuthenticated = store.check;
    const isGuestRoute = guestRoutes.some((route) => route.path === to.path) || to.meta.isPublic == true;

    let defaultRoute = '/login';
    if (isGuestRoute && isAuthenticated && !to.meta.isPublic) {
        next('/admin');
    } else if (!isGuestRoute && !isAuthenticated) {
        next(defaultRoute);
    } else {
        //console.log('allow');
        next();
    }
});

export default router;
*/
