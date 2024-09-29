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
import TaskTable from "@/views/TaskTable.vue";
import StatusTable from "@/views/StatusTable.vue";

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
      path: "/board/:boardId",
      name: "task",
      component: TaskTable,
      children: [
        {
          path: "task/:taskId",
          name: "taskdetail",
          component: TaskDetail,
        },
        {
          path: "task/add",
          name: "addtask",
          component: AddTaskModal,
        },
        {
          path: "task/:taskId/delete",
          name: "deleteTask",
          component: DeleteTaskModal,
        },
        {
          path: "task/:taskId/edit",
          name: "editTaskModal",
          component: EditTaskModal,
        },
      ],
    },
    {
      path: "/board/:boardId/status",
      name: "status",
      component: StatusTable,
      // children: [
      //   {
      //     path: "add",
      //     name: "addstatus",
      //     component: AddStatusModal,
      //   },
      //   {
      //     path: ":id/edit",
      //     name: "editstatus",
      //     component: EditStatusModal,
      //   },
      //   {
      //     path: ":id/delete",
      //     name: "deletestatus",
      //     component: DeleteStatusModal,
      //   },
      // ],
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
