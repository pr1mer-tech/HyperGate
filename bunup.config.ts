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
      external: [
        "zustand",
        "xrpl",
        "xumm",
        "@gemwallet/api",
        "@tanstack/react-query",
      ],
    },
  },
  {
    name: "@hyper-gate/react",
    root: "packages/ui",
    config: {
      entry: ["src/index.ts"],
      format: ["esm"],
      dts: false,
      external: ["react", "react-dom", "@tanstack/react-query"],
      target: "browser",
    },
  },
  {
    name: "@hyper-gate/connectkit",
    root: "packages/connectkit",
    config: {
      entry: ["src/index.ts"],
      format: ["esm"],
      dts: false,
      external: [
        "react",
        "react-dom",
        "framer-motion",
        "@hyper-gate/core",
        "@hyper-gate/react",
        "@tanstack/react-query",
      ],
      target: "browser",
    },
  },
]);
