import { Player, PlayerState, Stage, Vector2 } from "@motion-canvas/core";
import { ChangeEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon, RepeatIcon, Loader } from "./icons";

export default function MotionCanvasPlayer(
  { player, stageBg = "#000", changeStageBg = () => { } }: { player?: Player, stageBg?: string, changeStageBg?: (color: string) => void }
) {
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
        background: stageBg,
        range: [0, Infinity],
        size: new Vector2(1920, 1200),
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
  const stageBgInputRef = useRef<HTMLInputElement | null>(null);
  const startPlay = () => {
    player?.togglePlayback();
  }

  const toggleLoop = () => {
    player?.toggleLoop();
  }

  const changeBg = (event: ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    stage.configure({ background: color });
    changeStageBg(color);
  }

  useLayoutEffect(() => {
    cnvasRef.current?.append(stage.finalBuffer);
    return () => stage.finalBuffer.remove();
  }, [stage, cnvasRef]);

  return (
    <div className="flex flex-col gap-3">
      <div className="w-3/6 rounded-2xl bg-gray-400  backdrop-filter backdrop-blur-sm bg-opacity-40  left-0 right-0 mx-auto top-5 shadow-sm flex">
        <div className="grow flex basis-1 justify-center cursor-pointer hover:bg-gray-200 rounded-s-2xl h-9 items-center" onClick={startPlay}>
          {!!playerState?.paused ? <PlayIcon /> : <PauseIcon />}
        </div>
        {/* <div className={`grow flex justify-center cursor-pointer hover:bg-gray-200 items-center ${playerState.loop ? "text-blue-500" : ""}`} onClick={toggleLoop}>
          <MotionCanvasLibraryIcon />
        </div> */}
        <div className={`grow flex basis-1 justify-center cursor-pointer hover:bg-gray-200 h-9 items-center ${playerState?.loop ? "text-blue-500" : ""}`} onClick={toggleLoop}>
          <RepeatIcon />
        </div>
        {
          !playerState?.paused &&
          <div className={`grow flex basis-1 justify-center cursor-pointer hover:bg-gray-200 rounded-e-2xl h-9 items-center ${playerState?.loop ? "text-blue-500" : ""}`} onClick={() => stageBgInputRef.current?.focus()}>
            <input ref={stageBgInputRef} value={stageBg} type="color" className={`bg-transparent focus:bg-white w-10 box-content px-2 rounded-sm`} onChange={changeBg} />
          </div>
        }

      </div>

      {/* backdrop-blur-sm bg-transparent  */}
      <div className="flex relative w-full justify-center items-center bg-black px-5 pt-2 max-h-[700px]">
        <div ref={cnvasRef} className=" bg-no-repeat bg-cover " style={{
          transform: `translate(0px, 0px) scale(${0.4402237894654889})`,
        }}>
          {
            !player &&
            <div className="w-full h-full flex justify-center items-center">
              <Loader size={60} />
            </div>
          }
        </div>
      </div>

    </div>
  )
}