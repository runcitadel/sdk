import { terser } from "rollup-plugin-terser";
import ts from "rollup-plugin-ts";

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
      ts({
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
        file: "browser/useCitadel.js",
        format: "esm",
      },
    ],
    plugins: [
      ts({
        tsconfig: "tsconfig.browser.json",
      }),
      terser({
        ecma: 2020,
      }),
    ],
    external: ["react"],
  },
];
