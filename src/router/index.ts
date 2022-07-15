import { TITLE } from "@/config";
import { useStatusStore } from "@/stores/status";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: () => import("../views/LoggedViews/MainView.vue"),
      meta: {
        title: "主页",
        requiresAuth: true,
      },
      redirect: { name: "overview" },
      children: [
        {
          path: "/overview",
          name: "overview",
          component: () => import("../views/LoggedViews/OverviewView.vue"),
          meta: {
            title: "总览",
            requiresAuth: true,
          },
        },
        {
          path: "/survey",
          name: "survey",
          component: () => import("../views/LoggedViews/SurveyListView.vue"),
          meta: {
            title: "问卷",
            requiresAuth: true,
          },
        },
        {
          path: "/setting",
          name: "setting",
          component: () => import("../views/LoggedViews/SettingView.vue"),
          meta: {
            title: "设置",
            requiresAuth: true,
          },
        },
      ],
    },
    {
      path: "/edit",
      name: "edit",
      component: () => import("../views/LoggedViews/SurveyEditView.vue"),
      meta: {
        title: "编辑",
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: {
        title: "登录",
      },
    },
    {
      path: "/success",
      name: "success",
      component: () => import("../views/ResultViews/CommitSucceedView.vue"),
      meta: {
        title: "成功",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/ResultViews/NotFoundView.vue"),
      meta: {
        title: "发生错误",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.title && typeof to.meta.title === "string") {
    const mainTitle = TITLE;
    if (to.meta.title !== "") {
      document.title = to.meta.title + " | " + mainTitle;
    } else {
      document.title = mainTitle;
    }
  }
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !useStatusStore().logged
  ) {
    next({
      path: "/login",
      query: { redirect: to.fullPath }, // 登录成功后回到当前页面
    });
  } else {
    next();
  }
});

export default router;
