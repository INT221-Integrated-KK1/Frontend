import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",

    baseUrl: "http://intproj23.sit.kmutt.ac.th/kk1",
    // baseUrl: "http://localhost:5173/",
  },
});
