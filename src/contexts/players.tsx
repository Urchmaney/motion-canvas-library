import { Player } from "@motion-canvas/core";
import { createContext, ReactNode, useContext, useState } from "react";
import { CustomNodeCode } from "../interfaces";

interface PlayerConfig {
  playersData: { [key: string] : { player: Player, nodeCode: CustomNodeCode, bg?: string } },
  addComponentPlayerData: (componentId: string, player: Player, nodeCode: CustomNodeCode, bg?: string) => void
  savePlayerBg: (componentId: string | undefined, bg: string) => void
}

const PlayersContext = createContext<PlayerConfig>({
  playersData: {}, addComponentPlayerData: () => {}, savePlayerBg: () => {}
});

export function usePlayersContext(): PlayerConfig {
  return useContext(PlayersContext);
}

export function PlayersProvider({ children }: { children: ReactNode }){
  const [playersData, setPlayersData] = useState<Record<string,{ player: Player, nodeCode: CustomNodeCode, bg?:string }>>({});

  const addComponentPlayerData = (componentId: string, player: Player, nodeCode: CustomNodeCode, bg: string = "#000") => {
    setPlayersData((data) => ({ ...data, [componentId]:  { player, nodeCode, bg } }))
  }

  const savePlayerBg = (componentId: string | undefined, bg: string) => {
    if (!componentId) return;

    setPlayersData(data => ({ ...data, [componentId]: { ...data[componentId], bg } } ));
  }
    return (
      <PlayersContext.Provider value={{
        playersData, addComponentPlayerData, savePlayerBg
      }}>
        {children}
      </PlayersContext.Provider>
    )
}