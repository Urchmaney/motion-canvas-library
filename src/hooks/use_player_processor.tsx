import { Player } from "@motion-canvas/core";
import { useState } from "react";
import { createPlayer, createSceneFromCode } from "../util";

interface ProcessingState {
  state: "idle" | "processing" | "error" | "finished"
  message?: string
}

export function usePlayerProcessor() {
  const [processingState, setProcessingState] = useState<ProcessingState>({ state: "idle" });
  const [player, setPlayer] = useState<Player | null>(null);

  const processCode = async (code: string, cb?: (player: Player) => void) => {
    setProcessingState({ state: "processing" });
    createSceneFromCode(code).then((scene) => {
      const player = createPlayer(scene);
      setPlayer(player);
      setProcessingState({ state: "finished" });
      cb?.(player);
    }).catch(e => {
      setProcessingState({
        state: "error",
        message: e.message
      })
    });
  }
  
  return { processCode, player, processingState, setProcessingState, setPlayer }
}