import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",

    baseUrl: "http://ip23kk1.sit.kmutt.ac.th:3000",
  },
});
