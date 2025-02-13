import { defineConfig } from 'vite'
import { resolve } from "path"

export default defineConfig(({ command }) => {
  if (command === 'build') {
    return {
      root: 'src',
      build: {
        outDir: '../dist', 
        emptyOutDir: true, 
        lib: {
          entry: resolve(__dirname, "src/bibliolabel.js"),
          name: "BookLabel",
          fileName: "BookLabel",
        },
      },
    }
  } else {
    return {}
  }
})
