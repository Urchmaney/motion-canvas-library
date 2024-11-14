import { useState } from "react"
import { Editor, MotionCanvasPlayer } from "../components";
import { Player } from "@motion-canvas/core";

const defaultImport = `
import {} from "@motion-canvas/core";
import {} from "@motion-canvas/2d";
`

export default function Try() {
  const [tabs] = useState<string[]>(["Custom", "Usage"]);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [tabCodes, setTabCodes] = useState<string[]>([defaultImport, defaultImport]);
  const [run, setRun] = useState<boolean>(false);

  const tabCodeChange = (code: string) => {
    setRun(false);
    setTabCodes(prev => {
      const newTabCodes = [...prev];
      newTabCodes[currentTab] = code
      return newTabCodes;
    })
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
        </div>
      </div>
      <div className=" bg-[#FBFCFD] border border-cyan-100">
        <Editor code={tabCodes[currentTab]} onCodeChange={tabCodeChange} />
      </div>
      <div>
        {/* { run && <MotionCanvasPlayer player={new Player()} /> } */}
      </div>
    </div>
  )
}