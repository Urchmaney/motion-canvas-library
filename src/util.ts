import { bootstrap, FullSceneDescription, Logger, makeProject, MetaFile, Player } from "@motion-canvas/core";
import { bundle } from "./bundler";

export async function createSceneFromCode (code: string): Promise<FullSceneDescription<unknown>> {
  const bundledCode = await bundle(code);
  const blob = new Blob([bundledCode], { type: 'text/javascript' })
  const url = URL.createObjectURL(blob);
  const module = await import(
    /* @vite-ignore */url
  )
  URL.revokeObjectURL(url);
  const { default: scene } = module;
  return scene;
}

export function createPlayer(scene: FullSceneDescription<unknown>): Player {
  const logger = new Logger();
  logger.onLogged.subscribe(console.log);
  return new Player(bootstrap("repo",
    { core: "3.16.0", ui: "3.16.0", vitePlugin: "5.4.8", two: "3.16.0" },
    [],
    makeProject({ scenes: [scene] }),
    new MetaFile("scene"),
    new MetaFile("setting"),
    logger
  ));
}

export function combineCodes(codes: string[]): string {
  const importRegex = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g
  let result = codes[0];
  for (let i = 1; i < codes.length; i++) {
    const matches = codes[i].match(importRegex);
    const replaced = codes[i].replace(importRegex, "");
    if (matches) {
      const imports = matches.join("\n");
      result = `${imports}\n${result}`;
    }
    result = `${result}\n${replaced}`
  }
  return result;
}