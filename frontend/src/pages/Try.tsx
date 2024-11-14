import { useState } from "react"
import { Editor, MotionCanvasPlayer } from "../components";
import { Player } from "@motion-canvas/core";
import { Loader, PlayIcon } from "../components/icons";
import { createPlayer, createSceneFromCode } from "../util";

const defaultImport = `
import {} from "@motion-canvas/core";
import {} from "@motion-canvas/2d";
`

export default function Try() {
  const [tabs] = useState<string[]>(["Custom", "Usage"]);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [tabCodes, setTabCodes] = useState<string[]>([defaultImport, defaultImport]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [player, setPlayer] = useState<Player | null>(null);

  const tabCodeChange = (code: string) => {
    setTabCodes(prev => {
      const newTabCodes = [...prev];
      newTabCodes[currentTab] = code
      return newTabCodes;
    })
  }

  const processCode = () => {
    setProcessing(true);
    createSceneFromCode(tabCodes.join("\n")).then((scene) => {
      const player = createPlayer(scene);
      setPlayer(player);
      setProcessing(false);
    });
  }
  return (
    <div className="w-full flex flex-col h-lvh">
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
      <div>
        {
          processing && (<div className="w-full h-full flex justify-center items-center">
            <Loader size={60} />
          </div>)
        }
        {!processing && player && <MotionCanvasPlayer player={player} />}
      </div>
    </div>
  )
}