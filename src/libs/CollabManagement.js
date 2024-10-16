import { reactive } from "vue";

class CollabManagement {
  constructor() {
    this.collabs = reactive([]);
  }

  getCollabs() {
    return this.collabs;
  }

  setCollabs(collabs) {
    this.collabs = collabs;
    collabs.forEach((collab) => {
      this.collabs.push(collab);
    });
  }

  addCollab(collab) {
    this.collabs.push(collab);
  }

  removeCollab(id) {
    const index = this.collabs.findIndex((e) => e.id === Number(id));
    this.collabs.splice(index, 1);
  }
}

export { CollabManagement };
