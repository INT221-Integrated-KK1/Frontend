import { defineStore, acceptHMRUpdate } from "pinia";
import { reactive } from "vue";

const CollabManagement = defineStore("collabManagement", {
  state: () => ({
    collabs: reactive([]),
  }),

  actions: {
    getCollabs() {
      return this.collabs;
    },

    setCollabs(collabs = []) {
      this.collabs.length = 0;
      collabs.forEach((collab) => {
        this.collabs.push(collab);
      });
    },

    addCollab(collab) {
      this.collabs.push(collab);
    },

    updateCollab(id, updateItems) {
      const index = this.collabs.findIndex((e) => e.id === Number(id));
      this.collabs.splice(index, 1, {
        ...this.collabs[index],
        ...updateItems,
      });
    },

    removeCollab(id) {
      const index = this.collabs.findIndex((e) => e.id === Number(id));
      this.collabs.splice(index, 1);
    },
  },
});
export { CollabManagement };

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(CollabManagement, import.meta.hot));
}
