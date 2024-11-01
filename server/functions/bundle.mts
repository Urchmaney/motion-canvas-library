import type { Context } from "@netlify/functions";
import { buildSync } from "esbuild";

export default async (req: Request, context: Context) => {
  const code = (req.body || {})["code"];
  try {
    const result = buildSync({
      stdin: {
        contents: code,
        resolveDir: './src',
        loader: 'tsx',
      },
      bundle: true,
      jsxImportSource: "@motion-canvas/2d/lib",
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
    return new Response(e?.message, { status: 400 });
  }
}