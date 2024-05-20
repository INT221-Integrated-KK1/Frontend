import { createRouter, createWebHistory } from "vue-router";
import TaskDetail from "../components/TaskDetail.vue";
import EditTaskModal from "@/components/EditTaskModal.vue";
import DeleteModal from "../components/DeleteModal.vue";
import EditStatusModal from "@/components/EditStatusModal.vue";

const router = createRouter({
  history: createWebHistory("/kk1/"),
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
        },
        {
          path: "/status/:id/edit",
          name: "editstatus",
          component: EditStatusModal,
        },
      ],
    },
  ],
});
