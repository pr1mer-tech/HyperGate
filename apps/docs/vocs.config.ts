import { defineConfig } from "vocs";
import fs from "fs/promises";

const reactSideBar = async () => {
  const files = await fs.readdir("./pages/docs/react");
  return files.map((file) => ({
    text: file.replace(".mdx", ""),
    link: `/docs/react/${file.replace(".mdx", "")}`,
  }));
};

const utilsSideBar = async () => {
  const files = await fs.readdir("./pages/docs/utils");
  return files.map((file) => ({
    text: file.replace(".mdx", ""),
    link: `/docs/utils/${file.replace(".mdx", "")}`,
  }));
};

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
    {
      text: "React",
      collapsed: false,
      items: await reactSideBar(),
    },
    {
      text: "Utilities",
      collapsed: true,
      items: await utilsSideBar(),
    },
  ],
});

export default config;
