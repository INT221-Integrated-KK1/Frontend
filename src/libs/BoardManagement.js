import { reactive } from "vue";

class BoardManagement {
  constructor() {
    this.boards = reactive([]);
  }

  getBoards() {
    return this.boards;
  }

  setBoards(boards) {
    this.boards = boards;
  }

  addBoard(board) {
    this.boards.push(board);
  }

  editBoard(id, updateBoard) {
    const index = this.boards.findIndex((e) => e.id === Number(id));
    this.boards[index] = {
      ...this.boards[index],
      ...updateBoard,
    };
  }

  deleteBoard(id) {
    const index = this.boards.findIndex((e) => e.id === Number(id));
    this.boards.splice(index, 1);
  }
}

export { BoardManagement };
