import { reactive } from "vue";

class CollabManagement {
  constructor() {
    this.collabs = reactive([]);
  }

  getCollabs() {
    return this.collabs;
  }

  setCollabs(collabs = []) {
    this.collabs.length = 0;
    collabs.forEach((collab) => {
      this.collabs.push(collab);
    });
  }

  addCollab(collab) {
    this.collabs.push(collab);
  }

  updateCollab(id, updateItems) {
    const index = this.collabs.findIndex((e) => e.id === Number(id));
    this.collabs.splice(index, 1, {
      ...this.collabs[index],
      ...updateItems,
    });
  }

  removeCollab(id) {
    const index = this.collabs.findIndex((e) => e.id === Number(id));
    this.collabs.splice(index, 1);
  }
}

export { CollabManagement };
