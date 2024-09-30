import { defineStore, acceptHMRUpdate } from "pinia";
import { ref, watch } from "vue";

const useBoardStore = defineStore("board", () => {
  const boards = ref([]);

  const addBoard = (board) => {
    boards.value.push(board);
  };

  const setBoards = (newBoards) => {
    boards.value = newBoards;
  };

  const getBoardById = (id) => {
    return boards.value.find((b) => b.id === id);
  };

  const getBoards = () => {
    return boards.value;
  };

  const removeAllBoards = () => {
    boards.value = [];
  };

  return {
    boards,
    addBoard,
    setBoards,
    getBoardById,
    getBoards,
    removeAllBoards,
  };
});

export { useBoardStore };

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardStore, import.meta.hot));
}
