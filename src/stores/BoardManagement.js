import { defineStore, acceptHMRUpdate } from "pinia";
import { reactive } from "vue";

const BoardManagement = defineStore("boardManagement", {
  state: () => ({
    boards: reactive([]),
  }),

  actions: {
    getBoards() {
      return this.boards;
    },

    setBoards(boards) {
      this.boards = boards;
    },

    addBoard(board) {
      this.boards.push(board);
    },

    editBoard(id, updateBoard) {
      const index = this.boards.findIndex((e) => e.id === Number(id));
      if (index !== -1) {
        this.boards[index] = {
          ...this.boards[index],
          ...updateBoard,
        };
      }
    },

    deleteBoard(id, boardType) {
      if (boardType === "collab") {
        const index = this.boards.collabBoards.findIndex(
          (e) => e.id === Number(id)
        );
        if (index !== -1) {
          this.boards.collabBoards.splice(index, 1);
        }
      } else if (boardType === "personal") {
        const index = this.boards.personalBoards.findIndex(
          (e) => e.id === Number(id)
        );
        if (index !== -1) {
          this.boards.personalBoards.splice(index, 1);
        }
      }
    },
  },
});
export { BoardManagement };

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(BoardManagement, import.meta.hot));
}
