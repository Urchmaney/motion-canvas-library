import { Player, PlayerState, Stage, Vector2 } from "@motion-canvas/core";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon, RepeatIcon } from "./icons";

import { Loader } from "./icons/Loader";

export function MotionCanvasPlayer({ player }: { player: Player | undefined }) {
  const [stage] = useState<Stage>(new Stage());
  const [playerState, setPlayerState] = useState<PlayerState | undefined>(undefined);

  const renderStage = useCallback(async () => {
    if (player) {
      await stage.render(
        player.playback.currentScene,
        player.playback.previousScene,
      )
    }
  }, [player])

  useEffect(() => {
    let renderUnsubscription: () => void;
    let stateUnsubscription: () => void;

    if (player) {
      player.activate();
      renderStage();
      const stageConfiguration = {
        background: null,
        range: [0, Infinity],
        size: new Vector2((cnvasRef.current?.clientWidth || 1920) - 40, cnvasRef.current?.clientWidth || 1200),
        audioOffset: 0
      }
      player.configure({
        ...stageConfiguration, fps: 30, resolutionScale: 1, range: [0, Infinity]
      });
      stage.configure(stageConfiguration);
      renderUnsubscription = player.onRender.subscribe(renderStage)
      stateUnsubscription = player.onStateChanged.subscribe(setPlayerState)
    }

    return () => {
      stateUnsubscription?.();
      renderUnsubscription?.();
      player?.deactivate();
    }
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
          {!!playerState?.paused ? <PlayIcon /> : <PauseIcon />}
        </div>
        {/* <div className={`grow flex justify-center cursor-pointer hover:bg-gray-200 items-center ${playerState.loop ? "text-blue-500" : ""}`} onClick={toggleLoop}>
          <MotionCanvasLibraryIcon />
        </div> */}
        <div className={`grow flex justify-center cursor-pointer hover:bg-gray-200 rounded-e-2xl h-9 items-center ${playerState?.loop ? "text-blue-500" : ""}`} onClick={toggleLoop}>
          <RepeatIcon />
        </div>
      </div>

      {/* backdrop-blur-sm bg-transparent  */}
      <div ref={cnvasRef} className="px-5 pt-2 bg-no-repeat bg-cover w-full min-h-[700px]">
        {
          !player &&
          <div className="w-full h-full flex justify-center items-center">
            <Loader size={60} />
          </div>
        }
      </div>
    </div>
  )
}