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
    console.log(id);
    console.log(index);
    console.log(updateStatus);
    // this.statuses[index.id-1] = {
     this.statuses[index] = {
      ...this.statuses[index],
      ...updateStatus,
    };
    console.log(this.statuses[index]);
  }
}

export { StatusManagement };
