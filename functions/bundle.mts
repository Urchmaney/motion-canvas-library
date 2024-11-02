import type { Config, Context, HandlerEvent } from "@netlify/functions";
import path from "path";
import { buildSync} from "esbuild";

export default async (req: Request, event: HandlerEvent, context: Context) => {
  const data = await req.text()
  const code = JSON.parse(data)["code"];
  const currentPath = path.resolve(__dirname, '../../..', '../node_modules/')
  try {
    const result = buildSync({
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
    return new Response(`Error while bundling`, { status: 400 });
  }
}

export const config: Config = {
  method: "POST"
}