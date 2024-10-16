import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
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
import CollaboratorTable from "@/views/CollaboratorTable.vue";
import AccessDenied from "@/views/AccessDenied.vue";
import Conflict from "@/views/Conflict.vue";

import { addToken, getItemById } from "@/libs/fetchUtils";

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
          beforeEnter: async (to, from, next) => {
            try {
              const notOwner = ref(false);
              const boardId = to.params.boardId;
              const boardItems = await getItemById(
                import.meta.env.VITE_BASE_BOARDS_URL,
                boardId
              );
              console.log("boardItem", boardItems);

              boardItems.owner.name === localStorage.getItem("username")
                ? (notOwner.value = false)
                : (notOwner.value = true);

              if (notOwner.value === true) {
                next({ name: "Forbidden" });
              } else {
                next();
              }
            } catch (error) {
              console.error(`Error fetching board details: ${error}`);
              next({ name: "Forbidden" });
            }
          },
        },
        {
          path: "task/:taskId/delete",
          name: "deleteTask",
          component: DeleteTaskModal,
          // beforeEnter: async (to, from, next) => {
          //   try {
          //     const notOwner = ref(false);
          //     const boardId = to.params.boardId;
          //     const boardItem = await getItemById(
          //       import.meta.env.VITE_BASE_BOARDS_URL,
          //       boardId
          //     );
          //     boardItem.owner.name === localStorage.getItem("username")
          //       ? (notOwner.value = false)
          //       : (notOwner.value = true);

          //     if (notOwner.value === true) {
          //       next({ name: "Forbidden" });
          //     } else {
          //       next();
          //     }
          //   } catch (error) {
          //     console.error(`Error fetching board details: ${error}`);
          //     next({ name: "Forbidden" });
          //   }
          // },
        },
        {
          path: "task/:taskId/edit",
          name: "editTaskModal",
          component: EditTaskModal,
          // beforeEnter: async (to, from, next) => {
          //   try {
          //     const notOwner = ref(false);
          //     const boardId = to.params.boardId;
          //     const boardItem = await getItemById(
          //       import.meta.env.VITE_BASE_BOARDS_URL,
          //       boardId
          //     );
          //     boardItem.owner.name === localStorage.getItem("username")
          //       ? (notOwner.value = false)
          //       : (notOwner.value = true);

          //     if (notOwner.value === true) {
          //       next({ name: "Forbidden" });
          //     } else {
          //       next();
          //     }
          //   } catch (error) {
          //     console.error(`Error fetching board details: ${error}`);
          //     // next({ name: "Forbidden" });
          //   }
          // },
        },
      ],
    },
    {
      path: "/board/:boardId/status",
      name: "status",
      component: StatusTable,
      children: [
        {
          path: "add",
          name: "addstatus",
          component: AddStatusModal,
          beforeEnter: async (to, from, next) => {
            try {
              const notOwner = ref(false);
              const boardId = to.params.boardId;
              const boardItem = await getItemById(
                import.meta.env.VITE_BASE_BOARDS_URL,
                boardId
              );
              boardItem.owner.name === localStorage.getItem("username")
                ? (notOwner.value = false)
                : (notOwner.value = true);

              if (notOwner.value === true) {
                next({ name: "Forbidden" });
              } else {
                next();
              }
            } catch (error) {
              console.error(`Error fetching board details: ${error}`);
              next({ name: "Forbidden" });
            }
          },
        },
        {
          path: ":id/edit",
          name: "editstatus",
          component: EditStatusModal,
          // beforeEnter: async (to, from, next) => {
          //   try {
          //     const notOwner = ref(false);
          //     const boardId = to.params.boardId;
          //     const boardItem = await getItemById(
          //       import.meta.env.VITE_BASE_BOARDS_URL,
          //       boardId
          //     );
          //     boardItem.owner.name === localStorage.getItem("username")
          //       ? (notOwner.value = false)
          //       : (notOwner.value = true);

          //     if (notOwner.value === true) {
          //       next({ name: "Forbidden" });
          //     } else {
          //       next();
          //     }
          //   } catch (error) {
          //     console.error(`Error fetching board details: ${error}`);
          //     next({ name: "Forbidden" });
          //   }
          // },
        },
        {
          path: ":id/delete",
          name: "deletestatus",
          component: DeleteStatusModal,
          // beforeEnter: async (to, from, next) => {
          //   try {
          //     const notOwner = ref(false);
          //     const boardId = to.params.boardId;
          //     const boardItem = await getItemById(
          //       import.meta.env.VITE_BASE_BOARDS_URL,
          //       boardId
          //     );
          //     boardItem.owner.name === localStorage.getItem("username")
          //       ? (notOwner.value = false)
          //       : (notOwner.value = true);

          //     if (notOwner.value === true) {
          //       next({ name: "Forbidden" });
          //     } else {
          //       next();
          //     }
          //   } catch (error) {
          //     console.error(`Error fetching board details: ${error}`);
          //     next({ name: "Forbidden" });
          //   }
          // },
        },
      ],
    },
    {
      path: "/board/:boardId/collab",
      name: "collabTable",
      component: CollaboratorTable,
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFound,
    },
    {
      path: "/404",
      name: "NotFound",
      component: NotFound,
    },
    {
      path: "/403",
      name: "Forbidden",
      component: AccessDenied,
    },
    {
      path: "/409",
      name: "Conflict",
      component: Conflict,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const haveToken = localStorage.getItem("token");
  const haveRefreshToken = localStorage.getItem("refresh_token");


  if (haveRefreshToken) {
    try {
      let decodedToken = VueJwtDecode.decode(haveRefreshToken);
      const tokenExpire = new Date(decodedToken.exp * 1000);
      const now = new Date();
      if (tokenExpire < now) {
        localStorage.clear();
        router.push({ name: "login" });
      }
    } catch (error) {
      console.log("Refresh token validation error", error);
      localStorage.clear();
      router.push({ name: "login" });
    }
  }

  if (haveToken) {
    try {
      let decodedToken = VueJwtDecode.decode(haveToken);
      const tokenExpire = new Date(decodedToken.exp * 1000);
      const now = new Date();

      if (tokenExpire > now) {
        next();
        console.log("Token still valid");
      } else {
        console.log("Token expired");

        if (haveRefreshToken) {
          const res = await addToken(import.meta.env.VITE_BASE_TOKEN_URL);
          console.log("res", res);

          if (res.status === 401) {
            localStorage.clear();
            next({ name: "login" });
          } else {
            localStorage.setItem("token", res.access_token);
            next();
          }
        } else {
          localStorage.clear();
          next({ name: "login" });
        }
      }
    } catch (error) {
      console.log("Token validation error", error);
      localStorage.clear();
      next({ name: "login" });
    }
  } else if (haveRefreshToken) {
    const res = await addToken(import.meta.env.VITE_BASE_TOKEN_URL);
    if (res.status === 401) {
      localStorage.clear();
      next({ name: "login" });
    } else {
      localStorage.setItem("token", res.token);
      next();
    }
  } else {
    if (to.name !== "login" && !localStorage.getItem("token")) {
      next({ name: "login" });
    } else {
      next();
    }
  }
});

export default router;
