import { createRouter, createWebHistory } from "vue-router";
// import App from "../App.vue";
import TaskDetail from "../components/TaskDetail.vue";
import AddModal from "../components/AddModal.vue";
// import TaskTable from "../components/TaskTable.vue";
import EditTaskModal from "@/components/EditTaskModal.vue";
import DeleteModal from "../components/DeleteModal.vue";
import StatusTable from "../components/StatusTable.vue";
import TaskTable from "@/components/TaskTable.vue";

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
          name: "taskDetail",
          component: TaskDetail,
        },
        {
          path: "add",
          name: "addtask",
          component: AddModal,
        },
        {
          path: ":id/delete",
          name: "deleteTask",
          component: DeleteModal,
        },
        {
          path: ":id/edit",
          name: "editTaskModal",
          component: EditTaskModal,
        },
      ],
    },
    {
      path: "/task/:id",
      name: "taskDetail",
      component: TaskDetail,
    },
    // {
    //   path: "/task/add",
    //   name: "addtask",
    // },
    // {
    //   path: "/task/:id/delete",
    //   name: "deleteTask",
    //   component: DeleteModal,
    // },
    // {
    //   path: "/task/:id/edit",
    //   name: "editTaskModal",
    //   component: EditTaskModal,
    // },
    {
      path: "/status/manage",
      name: "status",
      component: StatusTable,
    },
  ],
});

export default router;
