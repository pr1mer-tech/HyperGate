import { defineConfig } from "vocs";

const config = defineConfig({
  rootDir: ".",
  title: "HyperGate",
  theme: {
    accentColor: {
      light: "black",
      dark: "white",
    },
  },
  topNav: [
    { text: "Guide & API", link: "/docs/getting-started", match: "/docs" },
  ],
});

export default config;
