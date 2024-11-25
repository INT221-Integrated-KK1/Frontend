import { defineStore, acceptHMRUpdate } from "pinia";
import { reactive } from "vue";

const StatusManagement = defineStore("statusManagement", {
  state: () => ({
    statuses: reactive([]),
  }),

  actions: {
    getStatus() {
      return this.statuses;
    },

    setStatuses(statuses = []) {
      this.statuses.length = 0;
      statuses.forEach((status) => {
        this.statuses.push(status);
      });
    },

    addStatus(status) {
      this.statuses.push(status);
    },

    deleteStatus(id) {
      const index = this.statuses.findIndex((e) => e.id === Number(id));
      if (index !== -1) {
        this.statuses.splice(index, 1);
      }
    },

    getStatusById(id) {
      return this.statuses.find((status) => status.id === Number(id));
    },

    editStatus(id, updateStatus) {
      const index = this.statuses.findIndex(
        (status) => status.id === Number(id)
      );
      if (index !== -1) {
        this.statuses[index] = {
          ...this.statuses[index],
          ...updateStatus,
        };
      }
    },
  },
});

export { StatusManagement };

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(StatusManagement, import.meta.hot));
}
