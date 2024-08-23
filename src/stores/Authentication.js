import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";

const Authentication = defineStore("isAuthenticated", () => {
  const isAuthenticated = ref(false);

  const getIsAuthenticated = () => {
    return isAuthenticated.value;
  };

  const setIsAuthenticated = (value) => {
    isAuthenticated.value = value;
  };

  return {
    isAuthenticated,
    getIsAuthenticated,
    setIsAuthenticated,
  };
});

export { Authentication };
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(Authentication, import.meta.hot));
}
