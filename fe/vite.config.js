import { defineConfig, loadEnv } from "vite";
import path from "path";

import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import { resolve } from "path";

//
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: process.env.VITE_BASE_PUBLIC_PATH,
    plugins: [
      //eslint({ cache: false }),
      //stylelint(),
      svgLoader(),
      vue(),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5185,
      watch: {
        additionalPaths: [
          path.resolve(__dirname, "node_modules/vue-tournament-bracket"),
        ],
      },
    },
  });
};
