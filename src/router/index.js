import { createRouter, createWebHistory } from "vue-router";
import TaskDetail from "@/components/modals/task/TaskDetail.vue";
import AddTaskModal from "@/components/modals/task/AddTaskModal.vue";
import EditTaskModal from "@/components/modals/task/EditTaskModal.vue";
import DeleteTaskModal from "@/components/modals/task/DeleteTaskModal.vue";
import AddStatusModal from "@/components/modals/status/AddStatusModal.vue";
import EditStatusModal from "@/components/modals/status/EditStatusModal.vue";
import DeleteStatusModal from "@/components/modals/status/DeleteStatusModal.vue";
import AddBoardModal from "@/components/modals/board/AddBoardModal.vue";

import VueJwtDecode from "vue-jwt-decode";
import NotFound from "@/views/NotFound.vue";
import Login from "@/views/Login.vue";
import Board from "@/views/Board.vue";


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
      path: "/board",
      name: "board",
      component: Board,
      children: [
        {
          path: "add",
          name: "addboard",
          component: AddBoardModal,
        },
      ],
    },
    {
      path: "/task",
      name: "task",
      component: () => import("@/views/TaskTable.vue"),
      children: [
        {
          path: ":id",
          name: "taskdetail",
          component: TaskDetail,
        },
        {
          path: "add",
          name: "addtask",
          component: AddTaskModal,
        },
        {
          path: ":id/delete",
          name: "deleteTask",
          component: DeleteTaskModal,
        },
        {
          path: ":id/edit",
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
          component: AddStatusModal,
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
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const haveToken = localStorage.getItem("token");
  console.log(typeof haveToken);

  if (haveToken) {
    if (haveToken.split(".").length !== 3 || typeof haveToken !== "string") {
      localStorage.clear();
    } else {
      try {
        let decodedToken = VueJwtDecode.decode(haveToken);
        const tokenExpire = new Date(decodedToken.exp * 1000);
        const now = new Date();
        if (tokenExpire < now) {
          localStorage.clear();
        }
      } catch (error) {
        console.log(error);
        localStorage.clear();
      }
    }
  } else {
    localStorage.clear();
  }

  if (to.name !== "login" && !localStorage.getItem("token"))
    next({ name: "login" });
  else next();
});

export default router;
