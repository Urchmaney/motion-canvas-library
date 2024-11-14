import { Player } from "@motion-canvas/core";
import { createContext, ReactNode, useContext, useState } from "react";

interface PlayerConfig {
  player: Player | null,
  setPlayer: (player: Player) => void
  componentId: string,
  setComponentId: (componentId: string) => void
}

const PlayerContext = createContext<PlayerConfig>({
  player: null, setPlayer: () => {}, componentId: "", setComponentId: () => {}
});

export function usePlayerContext(): PlayerConfig {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }: { children: ReactNode }){
  const [player, setPlayer] = useState<Player|null>(null);
  const [componentId, setComponentId] = useState<string>("");

    return (
      <PlayerContext.Provider value={{
        player, setPlayer, componentId, setComponentId
      }}>
        {children}
      </PlayerContext.Provider>
    )
}