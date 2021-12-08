import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "browser",
        format: "esm",
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        target: "esnext",
        tsconfig: "tsconfig.browser.json",
      }),
      terser({
        ecma: 2020,
      }),
    ],
  },
  {
    input: "src/useCitadel.ts",
    output: [
      {
        file: "browser/react.js",
        format: "esm",
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        target: "esnext",
        tsconfig: "tsconfig.browser.json",
      }),
      terser({
        ecma: 2020,
      }),
    ],
    external: ["react"],
  },
];
