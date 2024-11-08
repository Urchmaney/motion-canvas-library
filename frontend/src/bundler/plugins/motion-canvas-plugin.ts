import * as esbuild from 'esbuild-wasm';

export default function motionCanvasPlugin() {
  return ({
    name: 'motion-canvas',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /@motion-canvas\/2d$/ }, (_) => {
        const url = new URL("../motion-canvas-2d.js", window.location.href);
        return { path: url.href, namespace: 'a-2d' };
      });

      build.onResolve({ filter: /@motion-canvas\/core$/ }, (_) => {
        const url = new URL("../motion-canvas-core.js", window.location.href);
        return { path: url.href, namespace: 'a-core' };
      });

      build.onLoad({ filter: /.*/, namespace: 'a-2d' }, async (args: any) => {
        try {
          const response = await fetch(args.path);
          const data = await response.text();
          return {
            contents: data,
            loader: 'js',
          };
        } catch(e) {
          throw e
        }        
      });

      build.onLoad({ filter: /.*/, namespace: 'a-core' }, async (args: any) => {
        try {
          const response = await fetch(args.path);
          const data = await response.text();
          return {
            contents: data,
            loader: 'js',
          };
        }catch(e) {
          throw e
        }
        
      });
    }
  })
}