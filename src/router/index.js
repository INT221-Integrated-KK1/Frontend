import { createRouter, createWebHistory } from "vue-router";
import { addToken, getItemById, getItems } from "@/libs/fetchUtils";
import VueJwtDecode from "vue-jwt-decode";

import Login from "@/views/Login.vue";
import Board from "@/views/Board.vue";
import TaskTable from "@/views/TaskTable.vue";
import StatusTable from "@/views/StatusTable.vue";
import CollaboratorTable from "@/views/CollaboratorTable.vue";
import InviteCollaborator from "@/views/InviteCollaborator.vue";

import TaskDetail from "@/components/modals/task/TaskDetail.vue";
import AddTaskModal from "@/components/modals/task/AddTaskModal.vue";
import EditTaskModal from "@/components/modals/task/EditTaskModal.vue";
import DeleteTaskModal from "@/components/modals/task/DeleteTaskModal.vue";
import AddStatusModal from "@/components/modals/status/AddStatusModal.vue";
import EditStatusModal from "@/components/modals/status/EditStatusModal.vue";
import DeleteStatusModal from "@/components/modals/status/DeleteStatusModal.vue";
import AddBoardModal from "@/components/modals/board/AddBoardModal.vue";

import NotFound from "@/views/NotFound.vue";

const checkWriteAccess = async (to, from, next) => {
  try {
    const boardId = to.params.boardId;
    const userOid = localStorage.getItem("oid");

    const boardItems = await getItemById(
      import.meta.env.VITE_BASE_BOARDS_URL,
      boardId
    );
    const collabMembers = await getItems(
      `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/collabs`
    );

    const isOwner = boardItems.owner.oid === userOid;
    const hasWriteAccess = collabMembers.some(
      (member) => member.accessRight === "WRITE"
    );

    if (isOwner || hasWriteAccess) {
      next();
    } else {
      window.alert(
        "Access denied, you do not have permission to view this page."
      );
      router.go(-1);
    }
  } catch (error) {
    console.error(`Error fetching board details: ${error.message}`);
    window.alert(
      "An error occurred while fetching board details. Please try again later."
    );
    router.go(-1);
  }
};

const checkIsLogin = async (to, from, next) => {
  const haveToken = localStorage.getItem("token");

  if (!haveToken) {
    next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
};

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
            await checkWriteAccess(to, from, next);
          },
        },
        {
          path: "task/:taskId/delete",
          name: "deleteTask",
          component: DeleteTaskModal,
          beforeEnter: async (to, from, next) => {
            await checkWriteAccess(to, from, next);
          },
        },
        {
          path: "task/:taskId/edit",
          name: "editTaskModal",
          component: EditTaskModal,
          beforeEnter: async (to, from, next) => {
            await checkWriteAccess(to, from, next);
          },
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
            await checkWriteAccess(to, from, next);
          },
        },
        {
          path: ":id/edit",
          name: "editstatus",
          component: EditStatusModal,
          beforeEnter: async (to, from, next) => {
            await checkWriteAccess(to, from, next);
          },
        },
        {
          path: ":id/delete",
          name: "deletestatus",
          component: DeleteStatusModal,
          beforeEnter: async (to, from, next) => {
            await checkWriteAccess(to, from, next);
          },
        },
      ],
    },
    {
      path: "/board/:boardId/collab",
      name: "collabTable",
      component: CollaboratorTable,
    },
    {
      path: "/board/:boardId/collab/invitations/:invitationId",
      name: "invitations",
      component: InviteCollaborator,
      beforeEnter: async (to, from, next) => {
        await checkIsLogin(to, from, next);
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFound,
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
      console.error("Refresh token validation error", error);
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
      } else {
        if (haveRefreshToken) {
          const res = await addToken(import.meta.env.VITE_BASE_TOKEN_URL);

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
      console.error("Token validation error", error);
      localStorage.clear();
      next({ name: "login" });
    }
  } else if (haveRefreshToken) {
    const res = await addToken(import.meta.env.VITE_BASE_TOKEN_URL);
    if (res.status === 401) {
      localStorage.clear();
      next({ name: "login" });
    } else if (from.name === "invitations") {
      next({
        name: "invitations",
        params: {
          invitationId: from.params.invitationId,
          boardId: from.params.invitationId,
        },
      });
    } else {
      localStorage.setItem("token", res.token);
      next();
    }
  } else {
    next();
  }
});

export default router;
