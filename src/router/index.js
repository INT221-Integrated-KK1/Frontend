import { createRouter, createWebHistory } from "vue-router";
import TaskDetail from "@/components/TaskDetail.vue";
import EditTaskModal from "@/components/EditTaskModal.vue";
import DeleteTaskModal from "@/components/DeleteTaskModal.vue";
import EditStatusModal from "@/components/EditStatusModal.vue";
import DeleteStatusModal from "@/components/DeleteStatusModal.vue";
import Login from "@/views/Login.vue";
import { jwtDecode } from "jwt-decode";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/task",
      name: "task",
      component: () => import("@/views/TaskTable.vue"),
      children: [
        {
          path: "/task/:id",
          name: "taskdetail",
          component: TaskDetail,
        },
        {
          path: "/task/add",
          name: "addtask",
          component: () => import("@/components/AddTaskModal.vue"),
        },
        {
          path: "/task/:id/delete",
          name: "deleteTask",
          component: DeleteTaskModal,
        },
        {
          path: "/task/:id/edit",
          name: "editTaskModal",
          component: EditTaskModal,
        },
      ],
    },
    {
      path: "/status/manage",
      name: "status",
      component: () => import("@/views/StatusTable.vue"),
      children: [
        {
          path: "/status/add",
          name: "addstatus",
          component: () => import("@/components/AddStatusModal.vue"),
        },
        {
          path: "/status/:id/edit",
          name: "editstatus",
          component: EditStatusModal,
        },
        {
          path: "/status/:id/delete",
          name: "deletestatus",
          component: DeleteStatusModal,
        },
      ],
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isTokenExpire = localStorage.getItem("tokenexp");
  if (isTokenExpire) {
    const tokenExpire = new Date(isTokenExpire * 1000);
    const now = new Date();
    console.log("token exp: " + tokenExpire, " now: " + now);
    if (tokenExpire < now) {
      localStorage.clear();
    }
  } else {
    localStorage.clear();
  }

  const isTokenWellFormed = localStorage.getItem("token");
  if (isTokenWellFormed) {
    const decodedToken = jwtDecode(isTokenWellFormed);
    if (decodedToken === null || decodedToken === undefined || decodedToken === "") {
      localStorage.clear();
    }
  }

  if (to.name !== "login" && !localStorage.getItem("token"))
    next({ name: "login" });
  else next();
});

export default router;
