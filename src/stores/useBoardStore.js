import { defineStore, acceptHMRUpdate } from "pinia";
import { ref, watch } from "vue";

const useBoardStore = defineStore("board", () => {
  const boards = ref(JSON.parse(localStorage.getItem("boards")) || []);

  watch(
    boards,
    (newBoards) => {
      localStorage.setItem("boards", JSON.stringify(newBoards));
    },
    { deep: true }
  );

  const addBoard = (board) => {
    boards.value.push(board);
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
    getBoardById,
    getBoards,
    removeAllBoards,
  };
});

export { useBoardStore };

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardStore, import.meta.hot));
}
