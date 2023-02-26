import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/index",
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
      component: () => import("@/views/RegisterView.vue"),
      meta: {},
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("@/components/Logout.vue"),
    },
    {
      path: "/",
      name: "main",
      component: () => import("@/views/MainView.vue"),
      meta: {},
      children: [
        {
          path: "chat",
          name: "chat",
          component: () => import("@/views/ChatView.vue"),
        },
        {
          path: "contact",
          name: "contact",
          component: () => import("@/views/ContactView.vue"),
          children: [
            {
              path: "friend",
              name: "friend",
              component: () => import("@/components/contact/contactList/friendList.vue")
            },
            {
              path: "group",
              name: "group",
              component: () => import("@/components/contact/contactList/groupList.vue")
            }
          ]
        },
      ],
    },
  ],
});

export default router;
