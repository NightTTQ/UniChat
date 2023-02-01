import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/loginView.vue"),
      meta: {},
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/registerView.vue"),
      meta: {},
    },
    {
      path: "/main",
      name: "main",
      component: () => import("@/views/MainView.vue"),
      meta: {}
    }
  ],
});

export default router;
