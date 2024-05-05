import { createRouter, createWebHistory } from "vue-router";
// import App from "../App.vue";
import TaskDetail from "../components/TaskDetail.vue";
import AddModal from "../components/AddModal.vue";
// import TaskTable from "../components/TaskTable.vue";
import EditTaskModal from "@/components/EditTaskModal.vue";
import DeleteModal from "../components/DeleteModal.vue";

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
    },
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

    // {
    //   path: "/:notfoundpath(.*)",
    //   name: "NotFound",
    //   component: NotFound,
    // },

    {
      path: "/task/:id/edit",
      name: "editTaskModal",
      component: EditTaskModal,
    },
  ],
});

export default router;
