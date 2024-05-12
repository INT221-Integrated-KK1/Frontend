import { reactive } from "vue";

class StatusManagement {
  constructor() {
    this.status = reactive([]);
  }
  getStatus() {
    return this.status;
  }
  setStatuses(status = []) {
    this.status.length = 0;
    status.forEach((Status) => {
      this.status.push(Status);
    });
  }

  addStatus(Status) {
    this.status.push(Status);
  }

  deleteStatus(id) {
    const index = this.status.findIndex((e) => e.id === Number(id));
    this.status.splice(index, 1);
  }

  getStatusById(id) {
    return this.status.find((Status) => Status.id === id);
  }

  editStatus(id, updateStatus) {
    const index = this.status.findIndex((e) => e.id === Number(id));

    this.status[index] = {
      ...this.status[index],
      ...updateStatus,
    };
    console.log(this.status);
  }
}
export { StatusManagement };
