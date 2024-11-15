import { Player } from "@motion-canvas/core";
import { createContext, ReactNode, useContext, useState } from "react";

interface PlayerConfig {
  players: { [key: string] : Player },
  addComponentPlayer: (componentId: string, player: Player) => void
}

const PlayersContext = createContext<PlayerConfig>({
  players: {}, addComponentPlayer: () => {}
});

export function usePlayersContext(): PlayerConfig {
  return useContext(PlayersContext);
}

export function PlayersProvider({ children }: { children: ReactNode }){
  const [players, setPlayers] = useState<{ [key: string] : Player }>({});

  const addComponentPlayer = (componentId: string, player: Player) => {
    setPlayers((players) => ({ ...players, [componentId]: player }))
  }
    return (
      <PlayersContext.Provider value={{
        players, addComponentPlayer
      }}>
        {children}
      </PlayersContext.Provider>
    )
}