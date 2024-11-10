import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import esbuild from 'esbuild';


export default defineConfig(
  {
    plugins: [react(),
    {
      name: 'motion-canvas',
      async buildStart() {
        const entryFiles = [
          {
            in: resolve(__dirname, '../node_modules/@motion-canvas/2d/lib/index.js'), out: "2d",
          },
          {
            in: resolve(__dirname, '../node_modules/@motion-canvas/core/lib/index.js'), out: "core"
          }
        ]
        const outputDir = resolve("public/@motion-canvas")
        try {
          await esbuild.build({
            entryPoints: entryFiles,
            outdir: outputDir,
            bundle: true,
            chunkNames: 'chunks/[name]-[hash]',
            minify: true,
            splitting: true,
            format: 'esm',
          });
          console.log(`Motion Canvas bundled into: ${outputDir}`);
        } catch (error) {
          console.error("Failed to bundle the Motion Canvas:", error);
        }
      },
    },
    ]
  }
)
