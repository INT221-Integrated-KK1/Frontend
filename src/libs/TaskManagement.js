import { reactive } from "vue";

class TaskManagement {
  constructor() {
    this.tasks = reactive([]);
  }
  getTask() {
    return this.tasks;
  }
  setTasks(tasks = []) {
    this.tasks.length = 0;
    tasks.forEach((task) => {
      this.tasks.push(task);
    });
  }

  addTask(task) {
    this.tasks.push(task);
  }

  deleteTask(id) {
    const index = this.tasks.findIndex((e) => e.id === Number(id));
    this.tasks.splice(index, 1);
  }

  getTaskById(id) {
    return this.tasks.find((task) => task.id === id);
  }

  editTask(id, updateTaks) {
    const index = this.tasks.findIndex((e) => e.id === Number(id));

    this.tasks[index] = {
      ...this.tasks[index],
      ...updateTaks,
    };
    console.log(this.tasks);
  }

  sortTask() {
    return this.tasks.sort((a, b) =>
      b.status.name.localeCompare(a.status.name)
    );
  }
}
export { TaskManagement };
