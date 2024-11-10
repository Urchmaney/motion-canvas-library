import * as esbuild from 'esbuild-wasm';


export default function motionCanvasPlugin() {
  return ({
    name: 'motion-canvas',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /^(@motion-canvas\/2d|\.\/chunks\/|@motion-canvas\/core)/ }, (args: any) => {
        let pathUrl = args.path;
        if (pathUrl.match(/^\.\/chunks\//)) {
          pathUrl = `@motion-canvas/${pathUrl.substring(1)}`
        } else {
          pathUrl = `${pathUrl}.js`
        }
        const url = new URL(`../${pathUrl}`, window.location.href);
        return { path: url.href, namespace: 'motion-canvas' };
      });

      build.onLoad({ filter: /.*/, namespace: 'motion-canvas' }, async (args: any) => {
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
    }
  })
}