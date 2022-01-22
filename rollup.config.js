import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import ts from "rollup-plugin-ts";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist",
        format: "esm",
      },
    ],
    plugins: [
      ts(),
      nodeResolve(),
      commonjs(),
      terser(),
    ],
    external: ["undici"],
  },
  {
    input: "src/useCitadel.ts",
    output: [
      {
        file: "dist/useCitadel.js",
        format: "esm",
      },
    ],
    plugins: [
      ts(),
      nodeResolve(),
      commonjs(),
      terser(),
    ],
    external: ["undici", "react"],
  },
];
