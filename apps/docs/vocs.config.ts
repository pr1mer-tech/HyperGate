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
    { text: "Demo", link: "/docs/demo", match: "/docs/demo" },
  ],
  sidebar: [
    {
      text: "Getting Started",
      link: "/docs/getting-started",
    },
    {
      text: "Demo",
      link: "/docs/demo",
    },
  ],
});

export default config;
