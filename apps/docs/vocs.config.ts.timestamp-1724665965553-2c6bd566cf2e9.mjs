// vocs.config.ts
import { defineConfig } from "file:///Users/arguiot/Developer/Pyratz/HyperGate/node_modules/vocs/_lib/index.js";
import fs from "fs/promises";
var reactSideBar = async () => {
  const files = await fs.readdir("./docs/react");
  return files.map((file) => ({
    text: file.replace(".mdx", ""),
    link: `/docs/react/${file.replace(".mdx", "")}`
  }));
};
var config = defineConfig({
  rootDir: ".",
  title: "HyperGate",
  theme: {
    accentColor: {
      light: "black",
      dark: "white"
    }
  },
  topNav: [
    { text: "Guide & API", link: "/docs/getting-started", match: "/docs" },
    { text: "Demo", link: "/docs/demo", match: "/docs/demo" }
  ],
  sidebar: [
    {
      text: "Getting Started",
      link: "/docs/getting-started"
    },
    {
      text: "Demo",
      link: "/docs/demo"
    },
    {
      text: "React",
      collapsed: false,
      items: await reactSideBar()
    }
  ]
});
var vocs_config_default = config;
export {
  vocs_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidm9jcy5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXJndWlvdC9EZXZlbG9wZXIvUHlyYXR6L0h5cGVyR2F0ZS9hcHBzL2RvY3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hcmd1aW90L0RldmVsb3Blci9QeXJhdHovSHlwZXJHYXRlL2FwcHMvZG9jcy92b2NzLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXJndWlvdC9EZXZlbG9wZXIvUHlyYXR6L0h5cGVyR2F0ZS9hcHBzL2RvY3Mvdm9jcy5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidm9jc1wiO1xuaW1wb3J0IGZzIGZyb20gXCJmcy9wcm9taXNlc1wiO1xuXG5jb25zdCByZWFjdFNpZGVCYXIgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGZpbGVzID0gYXdhaXQgZnMucmVhZGRpcihcIi4vZG9jcy9yZWFjdFwiKTtcbiAgcmV0dXJuIGZpbGVzLm1hcCgoZmlsZSkgPT4gKHtcbiAgICB0ZXh0OiBmaWxlLnJlcGxhY2UoXCIubWR4XCIsIFwiXCIpLFxuICAgIGxpbms6IGAvZG9jcy9yZWFjdC8ke2ZpbGUucmVwbGFjZShcIi5tZHhcIiwgXCJcIil9YCxcbiAgfSkpO1xufTtcblxuY29uc3QgY29uZmlnID0gZGVmaW5lQ29uZmlnKHtcbiAgcm9vdERpcjogXCIuXCIsXG4gIHRpdGxlOiBcIkh5cGVyR2F0ZVwiLFxuICB0aGVtZToge1xuICAgIGFjY2VudENvbG9yOiB7XG4gICAgICBsaWdodDogXCJibGFja1wiLFxuICAgICAgZGFyazogXCJ3aGl0ZVwiLFxuICAgIH0sXG4gIH0sXG4gIHRvcE5hdjogW1xuICAgIHsgdGV4dDogXCJHdWlkZSAmIEFQSVwiLCBsaW5rOiBcIi9kb2NzL2dldHRpbmctc3RhcnRlZFwiLCBtYXRjaDogXCIvZG9jc1wiIH0sXG4gICAgeyB0ZXh0OiBcIkRlbW9cIiwgbGluazogXCIvZG9jcy9kZW1vXCIsIG1hdGNoOiBcIi9kb2NzL2RlbW9cIiB9LFxuICBdLFxuICBzaWRlYmFyOiBbXG4gICAge1xuICAgICAgdGV4dDogXCJHZXR0aW5nIFN0YXJ0ZWRcIixcbiAgICAgIGxpbms6IFwiL2RvY3MvZ2V0dGluZy1zdGFydGVkXCIsXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiBcIkRlbW9cIixcbiAgICAgIGxpbms6IFwiL2RvY3MvZGVtb1wiLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogXCJSZWFjdFwiLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBhd2FpdCByZWFjdFNpZGVCYXIoKSxcbiAgICB9LFxuICBdLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlUsU0FBUyxvQkFBb0I7QUFDeFcsT0FBTyxRQUFRO0FBRWYsSUFBTSxlQUFlLFlBQVk7QUFDL0IsUUFBTSxRQUFRLE1BQU0sR0FBRyxRQUFRLGNBQWM7QUFDN0MsU0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVO0FBQUEsSUFDMUIsTUFBTSxLQUFLLFFBQVEsUUFBUSxFQUFFO0FBQUEsSUFDN0IsTUFBTSxlQUFlLEtBQUssUUFBUSxRQUFRLEVBQUUsQ0FBQztBQUFBLEVBQy9DLEVBQUU7QUFDSjtBQUVBLElBQU0sU0FBUyxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLEVBQ1QsT0FBTztBQUFBLEVBQ1AsT0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLE1BQ1gsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixFQUFFLE1BQU0sZUFBZSxNQUFNLHlCQUF5QixPQUFPLFFBQVE7QUFBQSxJQUNyRSxFQUFFLE1BQU0sUUFBUSxNQUFNLGNBQWMsT0FBTyxhQUFhO0FBQUEsRUFDMUQ7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sV0FBVztBQUFBLE1BQ1gsT0FBTyxNQUFNLGFBQWE7QUFBQSxJQUM1QjtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBRUQsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
