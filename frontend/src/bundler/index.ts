import * as esbuild from 'esbuild-wasm';
import esbuildWasmUrl from '../../../node_modules/esbuild-wasm/esbuild.wasm?url'
import motionCanvasPlugin from './plugins/motion-canvas-plugin';
import jsxRuntimePlugin from './plugins/jsx-runtime-plugin';

let initialized: boolean;

export const bundle : (code: string) => Promise<string>= async (code: string) => {
  if(!initialized) {
    await esbuild.initialize({
      wasmURL: esbuildWasmUrl,
    }).then(_ => {
      console.log("esbuild initialized")
    });
    initialized = true;
  }

  const result = await esbuild.build({
    stdin: {
      contents: code,
      resolveDir: ".",
      loader: 'tsx',
    },
    bundle: true,
    jsxFactory: "jsx",
    jsx: "automatic",
    jsxFragment: 'Fragment',
    write: false,
    format: "esm",
    external: [
      "react/jsx-runtime"
    ],
    plugins: [
      motionCanvasPlugin(),
      jsxRuntimePlugin()
    ]
  });
  return result.outputFiles[0].text
}