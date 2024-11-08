import * as esbuild from 'esbuild-wasm';
import esbuildWasmUrl from '../../node_modules/esbuild-wasm/esbuild.wasm?url'

await esbuild.initialize({
  wasmURL: esbuildWasmUrl,
}).then(_ => {
  console.log("esbuild initialized")
});