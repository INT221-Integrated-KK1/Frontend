import { reactive } from "vue";

class StatusManagement {
  constructor() {
    this.statuses = reactive([]);
  }
  getStatus() {
    return this.statuses;
  }
  setStatuses(statuses = []) {
    this.statuses.length = 0;
    statuses.forEach((Status) => {
      this.statuses.push(Status);
    });
  }

  addStatus(Status) {
    this.statuses.push(Status);
  }

  deleteStatus(id) {
    const index = this.statuses.findIndex((e) => e.id === Number(id));
    this.statuses.splice(index, 1);
  }

  getStatusById(id) {
    return this.statuses.find((Status) => Status.id === id);
  }

  editStatus(id, updateStatus) {
    const index = this.statuses.findIndex((Status) => Status.id === id);
     this.statuses[index] = {
      ...this.statuses[index],
      ...updateStatus,
    };
  }
}

export { StatusManagement };
