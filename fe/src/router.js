import AuthLayout from "@/layouts/AuthLayout.vue";
import Index from "@/pages/index.vue";
import Login from "@/pages/login.vue";
import ForgotPassword from "@/pages/forgot-password.vue";
import ResetPassword from "@/pages/reset-password.vue";
import Players from "@/pages/players.vue";
import Player from "@/pages/player.vue";
import Rounds from "@/pages/rounds.vue";
import Options from "@/pages/options.vue";
import Settings from "@/pages/settings.vue";
import PlayerHelp from "@/pages/player-help.vue";
import NotFound from "@/pages/not-found.vue";
import Profile from "@/pages/profile.vue";
import MyOrganization from "@/pages/my-organization.vue";
import Super from "@/pages/super.vue";
import PrivacyPolicy from "@/pages/privacy-policy.vue";
import TermsOfService from "@/pages/terms-of-service.vue";
import DashLayout from "./layouts/DashLayout.vue";
import DocsLayout from "./layouts/DocsLayout.vue";
import PublicLayout from "./layouts/PublicLayout.vue";
import PublicEntryLayout from "./layouts/PublicEntryLayout.vue";
import BracketEdit from "@/pages/bracket.vue";
import Landing from "@/pages/landing.vue";
import Home from "@/pages/home.vue";
import Contact from "@/pages/contact.vue";
import Pricing from "@/pages/pricing.vue";
import Organization from "@/pages/organization.vue";
import PublicIndex from "@/pages/public/public-index.vue";
//import PublicEntry from "@/pages/public/public-entry.vue";
import PublicHome from "@/pages/public/public-home.vue";
import MapWrapper from "@/pages/mapwrapper.vue";

import { createRouter, createWebHistory } from "vue-router";

import { authStore } from "./store/auth";

const routes = [
  {
    path: "",
    name: "landing",
    component: Landing,
    meta: { isPublic: true },
  },
  {
    path: "/map",
    name: "map",
    component: MapWrapper,
    meta: { isPublic: true },
  },
  {
    path: "/pages",
    name: "pages",
    children: [
      {
        path: "contact/:flag?",
        name: "Contact",
        component: Contact,
        meta: { isPublic: true },
      },
      {
        path: "player-help",
        name: "PlayerHelp",
        component: PlayerHelp,
        meta: { isPublic: true },
      },
    ],
  },
  {
    path: "/join",
    name: "PublicPlay",
    meta: { isPublic: true },
    component: PublicEntryLayout,
    //children: [{ path: "", name: "PublicEntry", component: PublicEntry }],
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
        name: "auth-landing",
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
      {
        path: "/forgot-password",
        meta: { isPublic: true },
        name: "forgot-password",
        component: ForgotPassword,
      },
      {
        path: "/reset-password",
        meta: { isPublic: true },
        name: "reset-password",
        component: ResetPassword,
      },
    ],
  },
  {
    path: "/admin",
    component: DashLayout,
    children: [
      { path: "", name: "Bracket", component: Index },
      { path: "dashboard", name: "Dashboard", component: Index },
      { path: "rounds", name: "Rounds", component: Rounds },
      { path: "org", name: "Organization", component: Organization },
      { path: "players/:page?", name: "Players", component: Players },
      { path: "player/:id?", name: "Player", component: Player },
      { path: "settings", name: "Settings", component: Settings },
      { path: "profile", name: "My Profile", component: Profile },
      {
        path: "contact/:flag?",
        name: "contact",
        component: Contact,
      },
      {
        path: "pricing/:flag?",
        name: "pricing",
        component: Pricing,
      },
      {
        path: "my-organization",
        name: "Organization",
        component: MyOrganization,
      },
      {
        path: "brackets",
        name: "Brackets",
        component: MyOrganization,
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
      {
        path: "super",
        name: "Super Component",
        component: Super,
      },
    ],
  },

  {
    path: "/player/:view?",
    name: "player-home",
    meta: { isPlayerAuth: true },
    children: [
      {
        path: "",
        name: "PublicHome",
        component: PublicHome,
        meta: { isPlayerAuth: true },
      },
    ],
  },
  {
    path: "/docs",
    name: "documents",
    meta: { isPublic: true },
    component: DocsLayout,
    children: [
      {
        path: "privacy-policy",
        name: "PrivacyPolicy",
        component: PrivacyPolicy,
      },
      {
        path: "terms-of-service",
        name: "TermsOfService",
        component: TermsOfService,
      },
    ],
  },
  {
    path: "/:path",
    name: "Public",
    meta: { isPublic: true },
    component: PublicLayout,
    children: [{ path: "", name: "PublicIndex", component: PublicIndex }],
  },
  // {
  //   path: "/:path(.*)",
  //   name: "NotFound",
  //   component: NotFound,
  // },
];

// const router = createRouter({
//   history: createWebHistory(import.meta.env.VITE_BASE_PUBLIC_PATH),
//   routes,
// });

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PUBLIC_PATH),
  mode: "history",
  //base: '/',
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const store = authStore();
  const isAuthenticated = store.check; // For general authentication
  const isPlayer = store.checkIfPlayer; // For player-specific authentication

  const isPublicRoute = to.matched.some((record) => record.meta.isPublic);
  const isPlayerAuth = to.matched.some((record) => record.meta.isPlayerAuth);

  if (isPublicRoute) {
    if (isAuthenticated) {
      // Redirect authenticated non-players to their portal
      next("/admin");
    } else if (isPlayer) {
      // Redirect authenticated players to their portal
      next("/player");
    } else {
      // Allow access to public routes for unauthenticated users
      next();
    }
  } else if (isPlayerAuth) {
    if (isPlayer) {
      // Allow access to player-authenticated routes for players
      next();
    } else {
      // Redirect non-players to the admin portal or login page
      next(isAuthenticated ? "/admin" : "/login");
    }
  } else {
    if (isAuthenticated) {
      // Allow access to non-public, non-player-authenticated routes for authenticated non-players
      next();
    } else {
      // Redirect unauthenticated users to login for non-public routes
      next("/login");
    }
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
