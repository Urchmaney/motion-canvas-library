import { useCallback, useEffect, useState } from "react";
import { SearchIcon, Loader } from "../components/icons";
import { MotionCanvasPlayer } from "../components/MotionCavasPlayer";
import { CodeDisplay } from "../components/CodeDisplay";
import type { CustomNode, CustomNodeCode } from "../interfaces";
import { getCustomNodeCode, getCustomNodes } from "../services/library";
import { bootstrap, FullSceneDescription, Logger, makeProject, MetaFile, Player } from "@motion-canvas/core";
import { createSceneFromCode } from "../util";
import { bundle } from "../bundler";



function ComponentsListSidebar({ setSelectedNode }: { setSelectedNode: (id: string) => void }) {
  const [customeNodes, setCustomNodes] = useState<CustomNode[]>([]);
  useEffect(() => {
    getCustomNodes().then(nodes => {
      setCustomNodes(nodes);
      setSelectedNode(nodes[0]?.id)
    })
  }, [])
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
              <div className="flex justify-between cursor-pointer" onClick={() => setSelectedNode(node.id)} key={`custome_node_${id}`}>
                {node.name}
                <span className="text-xs rounded-md text-black bg-gray-300 flex items-center px-2">{node.numberOfCopies}</span>
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
  const [customNodeId, setCustomNodeId] = useState<string | null>(null);
  const [nodeCode, setNodeCode] = useState<CustomNodeCode | null>(null);
  const [nodePlayer, setNodePlayer] = useState<Player | null>(null);


  useEffect(() => {
    if (nodeCode) {

      const setupNodePlayer = async () => {
        const logger = new Logger();
        logger.onLogged.subscribe(console.log);
        const fullCode = `${nodeCode?.code}\n${nodeCode?.usage}`;
        const scene = await createSceneFromCode(fullCode);
        console.log(scene)
        setNodePlayer(new Player(bootstrap("repo",
          { core: "3.16.0", ui: "3.16.0", vitePlugin: "5.4.8", two: "3.16.0" },
          [],
          makeProject({ scenes: [scene as FullSceneDescription<unknown>] }),
          new MetaFile("scene"),
          new MetaFile("setting"),
          logger
        )));
      }
      setupNodePlayer().then(
        _ => console.log("setup complete"))
    }
  }, [nodeCode])

  useEffect(() => {
    if (customNodeId) {
      getCustomNodeCode(customNodeId).then(code => {
        setNodeCode(code);
      }).catch(_ => console.log("error setting up"));
    }
  }, [customNodeId]);

  return (
    <div className="md:flex gap-14 md:pt-8">
      <div className="basis-1/4">
        <ComponentsListSidebar setSelectedNode={(id: string) => setCustomNodeId(id)} />
      </div>
      <div className="grow min-w-0 pt-10 md:pt-0">
        <h2 className="font-bold text-2xl"> VSCode</h2>
        <p className="text-gray-500 py-2 text-lg">
          A visual studio code animation and abilities
        </p>

        <div className="py-5">
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

          <div className="w-full">
            {section === "preview" && nodePlayer && <MotionCanvasPlayer player={nodePlayer} />}
            {section === "preview" && !nodePlayer && (<div className="w-full h-full flex justify-center items-center">
              <Loader size={60} />
            </div>)}
            {section === "code" && <CodeDisplay code={nodeCode?.code || ""} />}
            {section === "usage" && <CodeDisplay code={nodeCode?.usage || ""} />}
          </div>
        </div>

      </div>
    </div>
  )
}