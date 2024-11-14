import { bundle } from "./bundler";

export const createSceneFromCode = async (code: string) => {
  const bundledCode = await bundle(code);
  const blob = new Blob([bundledCode], { type: 'text/javascript' })
  const url = URL.createObjectURL(blob);
  const module = await import(
    /* @vite-ignore */url
  )
  URL.revokeObjectURL(url) // GC objectURLs

  const { default: scene } = module;
  return scene;
}