import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";

import { addToken, getItemById, getItems } from "@/libs/fetchUtils";
import VueJwtDecode from "vue-jwt-decode";

import Login from "@/views/Login.vue";
import Board from "@/views/Board.vue";
import TaskTable from "@/views/TaskTable.vue";
import StatusTable from "@/views/StatusTable.vue";
import CollaboratorTable from "@/views/CollaboratorTable.vue";

import TaskDetail from "@/components/modals/task/TaskDetail.vue";
import AddTaskModal from "@/components/modals/task/AddTaskModal.vue";
import EditTaskModal from "@/components/modals/task/EditTaskModal.vue";
import DeleteTaskModal from "@/components/modals/task/DeleteTaskModal.vue";
import AddStatusModal from "@/components/modals/status/AddStatusModal.vue";
import EditStatusModal from "@/components/modals/status/EditStatusModal.vue";
import DeleteStatusModal from "@/components/modals/status/DeleteStatusModal.vue";
import AddBoardModal from "@/components/modals/board/AddBoardModal.vue";

import NotFound from "@/views/errors/NotFound.vue";
import AccessDenied from "@/views/errors/AccessDenied.vue";
import Conflict from "@/views/errors/Conflict.vue";

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
              const boardId = to.params.boardId;
              const userOid = localStorage.getItem("oid");

              // Fetch board and collaborators data in parallel
              
              const boardItems = await getItemById(
                import.meta.env.VITE_BASE_BOARDS_URL,
                boardId
              );
              const collabMembersResponse = await getItems(
                `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/collabs`
              );

              // Ensure collabMembers is an array
              const collabMembers = Array.isArray(collabMembersResponse)
                ? collabMembersResponse
                : [];

              // Check if user is the owner of the board
              const isOwner = boardItems.owner.oid === userOid;

              // Check if user has write access
              const hasWriteAccess = collabMembers.some(
                (member) =>
                  member.oid === userOid && member.accessRight === "write"
              );

              if (isOwner || hasWriteAccess) {
                // Allow navigation
                next();
              } else {
                // Deny access for users with only read access
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
              router.go(-1); // Redirect to the previous page on error
            }
          },
        },
        {
          path: "task/:taskId/delete",
          name: "deleteTask",
          component: DeleteTaskModal,

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
        },
        {
          path: ":id/edit",
          name: "editstatus",
          component: EditStatusModal,

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
      path: "/forbidden",
      name: "Forbidden",
      component: AccessDenied,
    },
    {
      path: "/conflict",
      name: "Conflict",
      component: Conflict,
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
    next();
  }
});

export default router;
