import { Player } from "@motion-canvas/core";
import { createContext, ReactNode, useContext, useState } from "react";
import { CustomNodeCode } from "../interfaces";

interface PlayerConfig {
  playersData: { [key: string] : { player: Player, nodeCode: CustomNodeCode } },
  addComponentPlayerData: (componentId: string, player: Player, nodeCode: CustomNodeCode) => void
}

const PlayersContext = createContext<PlayerConfig>({
  playersData: {}, addComponentPlayerData: () => {}
});

export function usePlayersContext(): PlayerConfig {
  return useContext(PlayersContext);
}

export function PlayersProvider({ children }: { children: ReactNode }){
  const [playersData, setPlayersData] = useState<Record<string,{ player: Player, nodeCode: CustomNodeCode }>>({});

  const addComponentPlayerData = (componentId: string, player: Player, nodeCode: CustomNodeCode) => {
    setPlayersData((data) => ({ ...data, [componentId]:  { player, nodeCode } }))
  }
    return (
      <PlayersContext.Provider value={{
        playersData, addComponentPlayerData
      }}>
        {children}
      </PlayersContext.Provider>
    )
}