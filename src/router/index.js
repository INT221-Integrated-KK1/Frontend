import { createRouter, createWebHistory } from "vue-router";
import TaskDetail from "../components/TaskDetail.vue";
import EditTaskModal from "@/components/EditTaskModal.vue";
import DeleteModal from "../components/DeleteModal.vue";
import EditStatusModal from "@/components/EditStatusModal.vue";
import DeleteStatusModal from "@/components/DeleteStatusModal.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/task",
    },
    {
      path: "/task",
      name: "task",
      component: () => import("../components/TaskTable.vue"),
      children: [
        {
          path: "/task/:id",
          name: "taskdetail",
          component: TaskDetail,
        },
        {
          path: "/task/add",
          name: "addtask",
          component: () => import("../components/AddTaskModal.vue"),
        },
        {
          path: "/task/:id/delete",
          name: "deleteTask",
          component: DeleteModal,
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
      component: () => import("../components/StatusTable.vue"),
      children: [
        {
          path: "/status/add",
          name: "addstatus",
          component: () => import("../components/AddStatusModal.vue"),
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
  ],
});

export default router;
