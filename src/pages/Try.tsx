import { useState } from "react"
import { Editor, MotionCanvasPlayer } from "../components";
import { Player } from "@motion-canvas/core";
import { CloseIcon, Loader, PlayIcon } from "../components/icons";
import { combineCodes, createPlayer, createSceneFromCode, getCodeFromLocalStorage, saveCodeToLocalStorage } from "../util";

interface ProcessingState {
  state: "idle" | "processing" | "error" | "finished"
  message?: string
}

const defaultImport = `
import {} from "@motion-canvas/core";
import {} from "@motion-canvas/2d";
`

export default function Try() {
  const [tabs] = useState<string[]>(["Custom", "Usage"]);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [tabCodes, setTabCodes] = useState<string[]>(tabs.map(x => getCodeFromLocalStorage(x) || defaultImport));
  const [processing, setProcessing] = useState<ProcessingState>({ state: "idle" });
  const [player, setPlayer] = useState<Player | null>(null);

  const tabCodeChange = (code: string) => {
    saveCodeToLocalStorage(tabs[currentTab], code);
    setTabCodes(prev => {
      const newTabCodes = [...prev];
      newTabCodes[currentTab] = code
      return newTabCodes;
    })
  }

  const processCode = () => {
    setProcessing({ state: "processing" });
    createSceneFromCode(combineCodes(tabCodes)).then((scene) => {
      const player = createPlayer(scene);
      setPlayer(player);
      setProcessing({ state: "finished" });
    }).catch(e => {
      setProcessing({
        state: "error",
        message: e.message
      })
    });
  }
  return (
    <div className="w-full flex flex-col relative overflow-hidden">
      <div className="basis-20 flex flex-col justify-end">
        <div className="px-5 flex gap-3">
          {
            tabs.map((tab, i) => (
              <div key={`tab_${i}`} className={`${i === currentTab ? "bg-[#FBFCFD]" : ""} p-3 rounded-t px-6 cursor-pointer`} onClick={() => setCurrentTab(i)}>{tab}</div>
            ))
          }
          <div className="grow px-6 flex justify-end">
            <button className="p-3" onClick={processCode}>
              <PlayIcon size={30} />
            </button>

          </div>
        </div>
      </div>
      <div className=" bg-[#FBFCFD] border border-cyan-100">
        <Editor code={tabCodes[currentTab]} onCodeChange={tabCodeChange} />
      </div>

      <div className={`absolute w-full top-0 min-h-40 bg-[#DEE9EE] transition-all duration-500 ${processing.state !== "idle" ? "right-0" : "-right-[100vw]"}`}>
        <div className="flex justify-end p-3"><button onClick={() => setProcessing({ state: "idle" })}><CloseIcon size={20} /></button></div>
        {
          processing.state === "processing" && (
            <div className="w-full h-full flex justify-center items-center">
              <Loader size={60} />
            </div>
          )
        }
        {processing.state === "finished" && player && <MotionCanvasPlayer player={player} />}
        {
          processing.state === "error" && (
            <div className="flex justify-center text-xl">{processing.message}</div>
          )
        }
      </div>
    </div>
  )
}