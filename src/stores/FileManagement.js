import { defineStore, acceptHMRUpdate } from "pinia";
import { reactive } from "vue";

const FileManagement = defineStore("fileManagement", {
  state: () => ({
    files: reactive([]),
  }),

  actions: {
    getFiles() {
      return this.files;
    },

    setFiles(files = []) {
      this.files.length = 0;
      files.forEach((file) => {
        this.files.push(file);
      });
    },


    addFile(file) {
      this.files.push(file);
    },

    deleteFile(id) {
      const index = this.files.findIndex((e) => e.id === Number(id));
      if (index !== -1) {
        this.files.splice(index, 1);
      }
    },

    getFileById(id) {
      return this.files.find((file) => file.id === Number(id));
    },
  },
});

export { FileManagement };

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(FileManagement, import.meta.hot));
}
