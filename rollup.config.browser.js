import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.browser.ts",
  output: [
    {
      dir: "browser",
      format: "esm",
    },
  ],
  plugins: [
    typescript({
      declaration: true,
      tsconfig: "tsconfig.browser.json"
    }),
  ],
};
