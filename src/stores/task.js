import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";

const TaskStore = defineStore("task", () => {
  const recentTask = ref();

  const addTodo = (todo) => {
    recentTask.value.todos.push(todo);
  };

  const getTodos = () => {
    return recentTask.value;
  };

  return {
    getTodos,
    addTodo,
  };
});
export { TaskStore };

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(TaskStore, import.meta.hot));
}
