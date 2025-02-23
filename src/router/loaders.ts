import type { ActionFunctionArgs } from "react-router-dom";
import { CustomNode } from "../interfaces";
import {firebaseLibrary} from "../services";

export async function loadLibraryNodes({ params }: ActionFunctionArgs) {
  const customeNodes = await firebaseLibrary.getCustomNodes();
  let parameterNode: CustomNode | null = null;
  if (params.id) {
    parameterNode = await firebaseLibrary.getCustomNode(params.id)
  }
  return {
    customeNodes,
    parameterNode
  }
}