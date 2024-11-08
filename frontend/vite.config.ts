import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import esbuild from 'esbuild';


export default defineConfig(
  {
    plugins: [react(),
      {
        name: 'bundle-and-copy-motion-canvas-core',
        async buildStart() {
          const entryFile = resolve(__dirname, '../node_modules/@motion-canvas/core/lib/index.js');
          const outputFile = resolve('public/motion-canvas-core.js');
  
          try {
            // Bundle the file with esbuild
            await esbuild.build({
              entryPoints: [entryFile],
              outfile: outputFile,
              bundle: true,
              minify: true,
              format: 'esm',
            });
            console.log(`Motion Canvas Core bundled into: ${outputFile}`);
          } catch (error) {
            console.error("Failed to bundle Motion Canvas Core :", error);
          }
        },
      },

      {
        name: 'bundle-and-copy-motion-canvas-2d',
        async buildStart() {
          const entryFile = resolve(__dirname, '../node_modules/@motion-canvas/2d/lib/index.js');
          const outputFile = resolve('public/motion-canvas-2d.js');
  
          try {
            await esbuild.build({
              entryPoints: [entryFile],
              outfile: outputFile,
              bundle: true,
              minify: true,
              format: 'esm',
            });
            console.log(`Motion Canvas 2d bundled into: ${outputFile}`);
          } catch (error) {
            console.error("Failed to bundle the Motion Canvas 2d:", error);
          }
        },
      },
    ]
  }
)
