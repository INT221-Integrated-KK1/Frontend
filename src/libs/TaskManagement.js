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
            // task.taskStatus = this.convertStatus(task.taskStatus);
            this.tasks.push(task);
        });
    }

  addTask(task) {
    this.tasks.push(task);
  }

  getTaskById(id) {
        return this.tasks.find((task) => task.taskId === id)
    }

    editTask(taskId, updateTaks) {
        const index = this.tasks.findIndex((e) => e.taskId === Number(taskId))
      
        this.tasks[index] = {
            ...this.tasks[index],
            ...updateTaks,
        }
        console.log(this.tasks);
    }

}
export { TaskManagement };
