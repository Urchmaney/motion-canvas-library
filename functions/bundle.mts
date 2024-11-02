import type { Config, Context, HandlerEvent } from "@netlify/functions";
import * as mc2d from "@motion-canvas/2d"
import path from "path";

export default async (req: Request, event: HandlerEvent, context: Context) => {
  const data = await req.text()
  const code = JSON.parse(data)["code"];
  const esbuild = require("esbuild")
  const currentPath = path.resolve(__dirname, '../../..', '../node_modules/')
  try {
    const result = esbuild.buildSync({
      stdin: {
        contents: code,
        resolveDir: './src',
        loader: 'tsx',
      },
    
      alias: {
        '@motion-canvas/2d': path.resolve(currentPath, "@motion-canvas/2d"),
        '@motion-canvas/core': path.resolve(currentPath, "@motion-canvas/core")
      },
      nodePaths: [currentPath],
      bundle: true,
      jsxImportSource: "@motion-canvas/2d/lib/",
      jsxFactory: "jsx",
      jsxFragment: 'Fragment',
      jsx: "automatic",
      write: false,
      platform: "node",
      tsconfigRaw: {},
      format: "esm"
    });
    return new Response(result.outputFiles[0].text, { status: 200 });
  } catch(e) {
    console.log("error")
    return new Response(`${e?.message}`, { status: 400 });
  }
}

export const config: Config = {
  method: "POST"
}