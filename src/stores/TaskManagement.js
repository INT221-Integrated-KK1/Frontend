import { defineStore, acceptHMRUpdate } from "pinia";
import { reactive } from "vue";

const TaskManagement = defineStore("taskManagement", {
  state: () => ({
    tasks: reactive([]),
  }),

  actions: {
    getTask() {
      return this.tasks;
    },

    setTasks(tasks = []) {
      this.tasks.length = 0;
      tasks.forEach((task) => {
        this.tasks.push(task);
      });
    },

    addTask(task) {
      this.tasks.push(task);
    },

    deleteTask(id) {
      const index = this.tasks.findIndex((e) => e.id === Number(id));
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }
    },

    getTaskById(id) {
      return this.tasks.find((task) => task.id === Number(id));
    },

    editTask(id, updateTask) {
      const index = this.tasks.findIndex((e) => e.id === Number(id));
      this.tasks[index] = {
        ...this.tasks[index],
        ...updateTask,
      };
    },

    sortTask(sortType) {
      if (sortType === "asc") {
        return this.tasks.sort((a, b) =>
          a.status.name.localeCompare(b.status.name)
        );
      } else if (sortType === "desc") {
        return this.tasks.sort((a, b) =>
          b.status.name.localeCompare(a.status.name)
        );
      } else if (sortType === "default") {
        return this.tasks.sort((a, b) => a.id - b.id);
      }
    },
  },
});

export { TaskManagement };

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(TaskManagement, import.meta.hot));
}
