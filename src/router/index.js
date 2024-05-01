import { createRouter, createWebHistory } from "vue-router";
// import App from "../App.vue";
// import TaskTable from "../components/TaskTable.vue";
import TaskDetail from "../components/TaskDetail.vue";


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
  ],
});

export default router;
