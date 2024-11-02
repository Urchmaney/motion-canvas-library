import { bootstrap, FullSceneDescription, Logger, makeProject, MetaFile, Player, PlayerState, Stage, Vector2 } from "@motion-canvas/core";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon, RepeatIcon } from "./icons";



async function loadRemoteNodeModule(url: string, code: string) {
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ code }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  const text = await result.text();

  if (URL.createObjectURL) {
    const blob = new Blob([text], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const module = await import(
        /* @vite-ignore */url
    )
    URL.revokeObjectURL(url) // GC objectURLs
    return module
  }
  const module = await import(
    /* @vite-ignore */`data:text/javascript,${text}`
  )
  // const node = (await promise).default;
  return module;


}

const createNodeScene = async (code: string) => {
  const { default: scene } = await loadRemoteNodeModule("http://localhost:8888/.netlify/functions/bundle/", code);
  return scene;
}

export const MotionCanvasPlayer = ({ code }: { code: string }) => {
  const [player, setPlayer] = useState<Player>();
  const [stage] = useState<Stage>(new Stage());
  const [playerState, setPlayerState] = useState<PlayerState>(
    {
      loop: true,
      muted: true,
      volume: 1,
      speed: 1,
      paused: true,
    }
  );

  useEffect(() => {
    const getScene = async () => {
      const logger = new Logger();
      const scene = await createNodeScene(code);
      setPlayer(new Player(bootstrap("repo",
        { core: "3.16.0", ui: "3.16.0", vitePlugin: "5.4.8", two: "3.16.0" },
        [],
        makeProject({ scenes: [scene as FullSceneDescription<unknown>] }),
        new MetaFile("scene"),
        new MetaFile("setting"),
        logger
      )))
    }
    getScene().then(_ => console.log("done"))
  }, []);


  useEffect(() => {
    const stageConfiguration = {
      background: null,
      range: [0, Infinity],
      size: new Vector2((cnvasRef.current?.clientWidth || 1920) - 40, cnvasRef.current?.clientHeight || 1200),
      audioOffset: 0
    }
    player?.configure({
      ...stageConfiguration, fps: 30, resolutionScale: 1, range: [0, Infinity]
    });
    stage.configure(stageConfiguration);
    player?.onRender.subscribe(async () => {
      await stage.render(
        player.playback.currentScene,
        player.playback.previousScene,
      );
    })
    player?.onStateChanged.subscribe((state) => {
      setPlayerState(state);
    })
  }, [player]);
  
  const cnvasRef = useRef<HTMLDivElement | null>(null);

  const startPlay = () => {
    player?.togglePlayback();
  }

  const toggleLoop = () => {
    player?.toggleLoop();
  }

  useLayoutEffect(() => {
    cnvasRef.current?.append(stage.finalBuffer);
    return () => stage.finalBuffer.remove();
  }, [stage, cnvasRef]);

  return (
    <div className="relative py-3">
      <div className="w-3/6 rounded-2xl bg-gray-400  backdrop-filter backdrop-blur-sm bg-opacity-40  left-0 right-0 mx-auto top-5 shadow-sm flex">
        <div className="grow flex justify-center cursor-pointer hover:bg-gray-200 rounded-s-2xl h-9 items-center" onClick={startPlay}>
          { !!playerState?.paused ? <PlayIcon /> : <PauseIcon /> }
        </div>
        {/* <div className={`grow flex justify-center cursor-pointer hover:bg-gray-200 items-center ${playerState.loop ? "text-blue-500" : ""}`} onClick={toggleLoop}>
          <MotionCanvasLibraryIcon />
        </div> */}
        <div className={`grow flex justify-center cursor-pointer hover:bg-gray-200 rounded-e-2xl h-9 items-center ${playerState.loop ? "text-blue-500" : ""}`} onClick={toggleLoop}>
          <RepeatIcon />
        </div>
      </div>

      {/* backdrop-blur-sm bg-transparent  */}
      <div ref={cnvasRef} className="px-5 pt-2 bg-no-repeat bg-cover w-full min-h-[700px]">

      </div>
    </div>

  )
}