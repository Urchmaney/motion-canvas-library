import express, { Express, Request, Response } from "express";
import cors from "cors";
import { buildSync } from "esbuild";

const app: Express = express();

app.use(express.json());

app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to library 01");
});

app.post("/bundle", (req: Request, res: Response) => {
  const code = req.body["code"];
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
  res.status(200).send(result.outputFiles[0].text);
})

const port: number = 3000;

app.listen(port, () => console.log(`listening at PORT ${port}`))