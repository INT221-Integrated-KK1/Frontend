import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import NotFound from "../views/NotFound.vue";
import TaskTable from "../views/TaskTable.vue";
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
      component: TaskTable,
    },
    {
      path: "/task/:id",
      name: "taskdetail",
      component: TaskDetail,
    },
    {
      path: "/:notfoundpath(.*)",
      name: "NotFound",
      component: NotFound,
    },
  ],
});

export default router;
