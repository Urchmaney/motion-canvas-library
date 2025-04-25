import { useMemo, useState } from "react"
import { Editor, Modal, MotionCanvasPlayer } from "../components";
import { Player } from "@motion-canvas/core";
import { CloseIcon, Loader, PlayIcon, UploadIcon } from "../components/icons";
import { combineCodes, createPlayer, createSceneFromCode, getCodeFromLocalStorage, saveCodeToLocalStorage } from "../util";
import { useParams } from "react-router-dom";
import { usePlayersContext } from "../contexts";
import { toast } from 'react-toastify';
import { firebaseLibrary } from "../services";
import { CustomNode } from "../interfaces";

interface ProcessingState {
  state: "idle" | "processing" | "error" | "finished"
  message?: string
}

const defaultImport = `
import {} from "@motion-canvas/core";
import {} from "@motion-canvas/2d";
`

const tabs = ["Custom", "Usage"] as const;

type Tab = typeof tabs[number]

export default function Try() {
  const { componentId } = useParams();
  const { playersData } = usePlayersContext();
  const componentCodes: Partial<Record<Tab, string | null>> = useMemo(() => {
    const nodeCode = playersData[componentId || ""]?.nodeCode
    return tabs.reduce<Partial<Record<Tab, string | null>>>((acc, x) => {
      if (x === "Custom") acc[x] = nodeCode?.code;
      else if (x === "Usage") acc[x] = nodeCode?.usage
      return acc
    }, {});
  }, [componentId]);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [tabCodes, setTabCodes] = useState<string[]>(tabs.map(x => componentCodes[x] || getCodeFromLocalStorage(x) || defaultImport));
  const [processing, setProcessing] = useState<ProcessingState>({ state: "idle" });
  const [player, setPlayer] = useState<Player | null>(null);

  const [openSubmitForm, setOpenSubmitForm] = useState<boolean>(false);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const github_name = (e.currentTarget.elements.namedItem("github_email") as HTMLInputElement).value;
      const component_name = (e.currentTarget.elements.namedItem("component_name") as HTMLInputElement).value;
      const component_desc = (e.currentTarget.elements.namedItem("component_desc") as HTMLInputElement).value;
      const customeNode: Omit<CustomNode, "id"> = { name: component_name, author_github: github_name, description: component_desc, approved: false, numberOfCopies: 0 };
      const node = await firebaseLibrary.addNewFullNode(customeNode , { code: tabCodes[0], usage: tabCodes[1] });
      setOpenSubmitForm(false);
      toast.success(`component with id '${node.id}' successfully submitted.`);
    } catch (e) {
      toast.error("Error occured while sending component.");
    }
  }

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
    <div className="w-full h-[calc(100vh-10vh)] flex flex-col relative overflow-hidden">
      <div className="basis-20 flex flex-col justify-end">
        <div className="px-5 flex gap-3">
          {
            tabs.map((tab, i) => (
              <div key={`tab_${i}`} className={`${i === currentTab ? "bg-[#FBFCFD]" : ""} p-3 rounded-t px-6 cursor-pointer`} onClick={() => setCurrentTab(i)}>{tab}</div>
            ))
          }
          <div className="grow px-6 flex justify-end items-center pb-2 gap-6 flex-wrap">

            <button type="button" className="p-2 flex gap-1 items-center bg-gray-300 rounded-md h-10 font-semibold" onClick={() => { setOpenSubmitForm(true) }}>
              Submit <UploadIcon size={20} />
            </button>
            <button className="p-3" onClick={processCode}>
              <PlayIcon size={30} />
            </button>

          </div>
        </div>
      </div>
      <div className=" bg-[#FBFCFD] border border-cyan-100 overflow-y-scroll">
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

      <Modal isOpen={openSubmitForm} onClose={() => { setOpenSubmitForm(false) }}>
        <form className="flex flex-col gap-4" onSubmit={submitForm}>
          <div>
            <h3 className="text-lg text-center font-semibold">Submit your component to be added into the library</h3>
          </div>
          <hr />
          <div>
            <label htmlFor="github_email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Github Username</label>
            <input type="text" name="github_email" id="github_email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="username" required />
          </div>

          <div>
            <label htmlFor="component_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Component Name</label>
            <input type="text" name="component_name" id="component_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name" required />
          </div>

          <div>
            <label htmlFor="component_desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Component Name</label>
            <textarea name="component_desc" id="component_desc" rows={4} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="description" required />
          </div>

          <button type="submit" className="w-full text-white bg-[#2f4f5f] hover:bg-[#2f4f4f] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#2f4f5f] dark:hover:bg-[#2f4f4f] dark:focus:ring-blue-300">Submit</button>
        </form>
      </Modal>
    </div>
  )
}