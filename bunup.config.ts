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
      external: ["zustand", "xrpl", "xumm", "@gemwallet/api"],
    },
  },
  {
    name: "@hyper-gate/react",
    root: "packages/ui",
    config: {
      entry: ["src/exports/index.ts"],
      format: ["esm"],
      dts: false,
      external: ["react", "react-dom"],
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
      ],
      target: "browser",
    },
  },
]);
