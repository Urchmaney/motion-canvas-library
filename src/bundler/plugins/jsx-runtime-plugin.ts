import * as esbuild from 'esbuild-wasm';

export default function jsxRuntimePlugin() {
  return ({
    name: 'jsx-runtime',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /^react\/jsx-runtime$/ }, (args) => {
        return {
          path: args.path,
          namespace: "runtime"
        }
      })

      build.onLoad({ filter: /.*/, namespace: "runtime" }, (_) => {
        return {
          contents: "export { jsx, jsxs, Fragment } from '@motion-canvas/2d'",
          loader: "js"
        }
      })
    }
  })
}