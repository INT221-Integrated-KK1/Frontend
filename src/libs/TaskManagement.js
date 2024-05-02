import { reactive } from "vue";

class TaskManagement {

    constructor() {
        this.tasks = reactive([])
    }
    getTask() {
        return this.tasks
    }
    setTasks(tasks = []) {
        this.tasks.length = 0;
        tasks.forEach((task) => {
            task.taskStatus = this.convertStatus(task.taskStatus);
            this.tasks.push(task);
        });
    }
    convertStatus(status) {
        const lowerLetter = status.toLowerCase()
        const capitalizedStatus = lowerLetter.charAt(0).toUpperCase() + lowerLetter.slice(1);
        const convertStatus = capitalizedStatus.replace(/_/g, " ");
        return convertStatus;
    }
    getTaskById(id) {
        return this.tasks.find((task) => task.id === id)
    }
}
export { TaskManagement }