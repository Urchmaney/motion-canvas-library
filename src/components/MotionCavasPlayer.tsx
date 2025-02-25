import { Player, PlayerState, Stage, Vector2 } from "@motion-canvas/core";
import { ChangeEvent, FormEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon, RepeatIcon, Loader } from "./icons";
import GoodScoreIcon from "./icons/GoodScore";

export function MotionCanvasPlayer({ player, stageBg = "#000" }: { player?: Player, stageBg?: string }) {
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

  const changStageBackgroundColor = (event: FormEvent) => {
    event.preventDefault();
    const color = stageBgInputRef.current?.value;
    const style = new Option().style;
    style.color = color || "";
    if (color && style.color != color && !(/^#([0-9A-F]{3})+$/i.test(color))) return;
    stage.configure({ background: color });
  }

  const adjustStageBgTextWidth = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (stageBgInputRef.current) {
      stageBgInputRef.current.style.width = Math.max(val.length, 2) + "ch";
    }
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
            <form className={`flex justify-center h-2/3`} onSubmit={changStageBackgroundColor}>
              <input style={{ width: `${stageBg.length}ch`}} ref={stageBgInputRef} defaultValue={stageBg} type="text" className={`bg-transparent focus:bg-white w-2 box-content px-2 rounded-sm`} onChange={adjustStageBgTextWidth} />
              <button type="submit">
                <GoodScoreIcon />
              </button>
            </form>
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