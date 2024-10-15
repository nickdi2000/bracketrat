import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Pricing from "./pages/Pricing.vue";
import About from "./pages/About.vue";
import Blog from "./pages/Blog.vue";
import BlogPost from "./pages/BlogPost.vue";
import Help from "./pages/Help.vue";
import Newsletter from "./pages/Newsletter.vue";
import Contact from "./pages/Contact.vue";
import SignIn from "./pages/SignIn.vue";
import SignUp from "./pages/SignUp.vue";
import ResetPassword from "./pages/ResetPassword.vue";
import PageNotFound from "./pages/PageNotFound.vue";

const routerHistory = createWebHistory();

const router = createRouter({
  scrollBehavior(to) {
    if (to.hash) {
      window.scroll({ top: 0 });
    } else {
      document.querySelector("html").style.scrollBehavior = "auto";
      window.scroll({ top: 0 });
      document.querySelector("html").style.scrollBehavior = "";
    }
  },
  history: routerHistory,
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/pricing",
      component: Pricing,
    },
    {
      path: "/about",
      component: About,
    },
    {
      path: "/blog",
      component: Blog,
    },
    {
      path: "/blog-post",
      component: BlogPost,
    },
    {
      path: "/help",
      component: Help,
    },
    {
      path: "/newsletter",
      component: Newsletter,
    },
    {
      path: "/contact",
      component: Contact,
    },
    {
      path: "/signin",
      component: SignIn,
    },
    {
      path: "/signup",
      component: SignUp,
    },
    {
      path: "/reset-password",
      component: ResetPassword,
    },
    {
      path: "/:pathMatch(.*)*",
      component: PageNotFound,
    },
  ],
});

export default router;
