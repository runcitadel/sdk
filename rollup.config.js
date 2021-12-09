import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import ttypescript from "ttypescript";

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
      typescript({
        typescript: ttypescript,
        declaration: true,
        target: "esnext",
      }),
      nodeResolve(),
      commonjs(),
      terser(),
    ],
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
      typescript({
        typescript: ttypescript,
        declaration: true,
        target: "esnext",
      }),
      nodeResolve(),
      commonjs(),
      terser(),
    ],
    external: ["react"],
  },
];
