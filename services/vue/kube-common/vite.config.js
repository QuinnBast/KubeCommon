import { fileURLToPath, URL } from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'


// https://vite.dev/config/
export default ({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    base: mode === 'development' ? '' : './',
    define: {
      "process.env": env,
    },
    plugins: [
      vue(),
      vueDevTools(),
    ],
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    build: {
      // outDir: "../../kubeCommon/src/main/resources/web",
      outDir: "./dist",
      emptyOutDir: true,
    }
  });
};
