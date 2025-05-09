import { defineWorkspace } from "bunup";

export default defineWorkspace([
  {
    name: "@hyper-gate/core",
    root: "packages/core",
    config: {
      entry: ["src/index.ts"],
      format: ["esm", "cjs"],
      dts: false,
      target: "browser",
    },
  },
  {
    name: "@hyper-gate/react",
    root: "packages/ui",
    config: {
      entry: ["src/exports/index.ts"],
      format: ["esm", "cjs"],
      dts: false,
      external: ["react"],
      target: "browser",
    },
  },
  {
    name: "@hyper-gate/connectkit",
    root: "packages/connectkit",
    config: {
      entry: ["src/index.ts"],
      format: ["esm", "cjs"],
      dts: false,
      external: ["react"],
      target: "browser",
    },
  },
]);
