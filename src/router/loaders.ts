import type { ActionFunctionArgs } from "react-router-dom";
import { CustomNode } from "../interfaces";
import { getCustomNode, getCustomNodes } from "../services/library";

export async function loadLibraryNodes({ params }: ActionFunctionArgs) {
  const customeNodes = await getCustomNodes();
  let parameterNode: CustomNode | null = null;
  if (params.id) {
    parameterNode = await getCustomNode(params.id)
  }
  return {
    customeNodes,
    parameterNode
  }
}