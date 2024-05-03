import { createRouter, createWebHistory } from "vue-router";
// import App from "../App.vue";
// import TaskTable from "../components/TaskTable.vue";
import TaskDetail from "../components/TaskDetail.vue";
import EditTaskModal from "@/components/EditTaskModal.vue";


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
      path: "/task/:taskId",
      name: "taskdetail",
      component: TaskDetail,
    },
    // {
    //   path: "/:notfoundpath(.*)",
    //   name: "NotFound",
    //   component: NotFound,
    // },

    {
      path: "/task/:taskId/edit",
      name: "editTaskModal",
      component: EditTaskModal,
    },

  ],
});

export default router;
