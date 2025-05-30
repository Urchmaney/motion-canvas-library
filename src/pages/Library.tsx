import { useEffect, useState } from "react";
import { SearchIcon, Loader } from "../components/icons";
import { MotionCanvasPlayer } from "../components";
import { CodeDisplay } from "../components/CodeDisplay";
import type { CustomNode, CustomNodeCode } from "../interfaces";
import type { Player } from "@motion-canvas/core";
import { combineCodes } from "../util";
import { usePlayersContext } from "../contexts";
import { NavLink, useLoaderData } from "react-router-dom";
import { firebaseLibrary } from "../services";
import EditIcon from "../components/icons/Edit";
import { usePlayerProcessor } from "../hooks";



function ComponentsListSidebar({ setSelectedNode }: { setSelectedNode: (node: CustomNode) => void }) {
  const [activeId, setActiveId] = useState<string | undefined>();
  const { customeNodes, parameterNode } = useLoaderData() as { customeNodes: CustomNode[], parameterNode: CustomNode };

  useEffect(() => {
    if (parameterNode) {
      setSelectedNode(parameterNode);
      setActiveId(parameterNode.id);
      return;
    }
    setSelectedNode(customeNodes[0]);
    setActiveId(customeNodes[0]?.id);

  }, [customeNodes, parameterNode]);

  const selectNode = (node: CustomNode) => {
    setSelectedNode(node);
    setActiveId(node.id);
  }
  return (
    <div className="pe-3">
      <div>
        <form action="/search" className="w-full">
          <div className="relative">
            <input type="text" name="q" className="w-full border outline-none h-8 shadow p-4 rounded-full dark:text-gray-800 dark:border-gray-700 bg-gray-200" placeholder="search" />
            <button type="submit">
              <SearchIcon classString="text-teal-400 h-4 w-4 absolute top-2.5 right-3 fill-current dark:text-teal-300" />
            </button>
          </div>
        </form>
      </div>

      <div className="pt-5 flex flex-col gap-3">
        <h3 className="font-bold ">
          Components
        </h3>
        <div className="text-gray-500 flex flex-col gap-3">
          {
            customeNodes.map((node, id) => (
              <div className={`flex justify-between cursor-pointer`} onClick={() => selectNode(node)} key={`custome_node_${id}`}>
                <div className="flex justify-start">
                  <p className={`p-1 min-w-40  ${activeId === node.id ? "bg-[#D1D5DB] pe-6" : ""}`}>{node.name}</p>
                  {activeId === node.id && <p className="h-full border-l-[50px] border-t-[33.5px] border-t-transparent border-l-secondary"></p>}
                </div>
                <span className="text-xs rounded-md text-black bg-secondary flex items-center px-2">{node.numberOfCopies}</span>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default function Library() {
  const [section, setSection] = useState<"preview" | "code" | "usage">("preview")
  const [customNode, setCustomNode] = useState<CustomNode | null>(null);
  const [nodeCode, setNodeCode] = useState<CustomNodeCode | null>(null);
  const [switchingPlayer, setSwitchingPlayer] = useState<boolean>(false);

  const { playersData, addComponentPlayerData, savePlayerBg } = usePlayersContext();
  const { player, setPlayer, processCode } = usePlayerProcessor();

  useEffect(() => {
    if (customNode) {
      if (playersData[customNode.id]) {
        setPlayer(playersData[customNode.id].player);
        setNodeCode(playersData[customNode.id].nodeCode);
        return;
      }
      setSwitchingPlayer(true);
      firebaseLibrary.getCustomNodeCode(customNode.id).then(code => {
        setNodeCode(code);
        return processCode(combineCodes([code?.code || "", code?.usage || ""]), (player: Player) => {
          addComponentPlayerData(customNode.id, player, code, customNode.bg);
          setSwitchingPlayer(false);
        })
      }).then(
        _ => console.log("setup complete")).catch(_ => console.log("error setting up"));
    }
  }, [customNode?.id]);

  return (
    <div className="md:flex gap-14 md:pt-8 h-full">
      <div className="basis-1/4">
        <ComponentsListSidebar setSelectedNode={(node: CustomNode) => setCustomNode(node)} />
      </div>
      <div className="grow min-w-0 pt-10 md:pt-0 flex flex-col">
        <div className="flex justify-between">
          <h2 className="flex font-bold text-2xl">{customNode?.name} </h2>

          <NavLink
            to={`/try/${customNode?.id}`}
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            <EditIcon />
          </NavLink>
        </div>
        <p className="flex text-gray-500 py-2 text-lg">
          {customNode?.description}
        </p>

        <div className="flex-auto py-5">
          <div className="border-b border-gray-200 flex gap-3">
            <p className={`px-3 cursor-pointer ${section === "preview" ? "border-b border-black font-bold" : ""}`} onClick={() => setSection("preview")}>
              Preview
            </p>
            <p className={`px-3 cursor-pointer ${section === "code" ? "border-b border-black font-bold" : ""}`} onClick={() => setSection("code")}>
              Code
            </p>
            <p className={`px-3 cursor-pointer ${section === "usage" ? "border-b border-black font-bold" : ""}`} onClick={() => setSection("usage")}>
              Usage
            </p>
          </div>

          <div className="w-full py-3">
            {
              section === "preview" && ((player && !switchingPlayer) ?
                <MotionCanvasPlayer
                  player={player}
                  stageBg={playersData[customNode?.id || ""]?.bg}
                  changeStageBg={(color) => savePlayerBg(customNode?.id, color)}
                /> :
                (<div className="w-full h-full flex justify-center items-center">
                  <Loader size={60} />
                </div>))
            }
            {section === "code" && <CodeDisplay code={nodeCode?.code || ""} />}
            {section === "usage" && <CodeDisplay code={nodeCode?.usage || ""} />}
          </div>
        </div>

      </div>
    </div>
  )
}
