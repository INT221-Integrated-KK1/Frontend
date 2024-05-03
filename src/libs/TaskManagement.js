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
      task.status = this.convertStatus(task.status);
      this.tasks.push(task);
    });
  }

  addTask(task) {
    this.tasks.push(task);
  }

  convertStatus(status) {
    const lowerLetter = status.toLowerCase();
    const capitalizedStatus =
      lowerLetter.charAt(0).toUpperCase() + lowerLetter.slice(1);
    const convertStatus = capitalizedStatus.replace(/_/g, " ");
    return convertStatus;
  }
  getTaskById() {
    return this.tasks;
  }
}
export { TaskManagement };
