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
          formats: ['es'],
          entry: resolve(__dirname, "src/booklabel.js"),
          fileName: "booklabel"
        },
      },
    }
  } else {
    return {}
  }
})
