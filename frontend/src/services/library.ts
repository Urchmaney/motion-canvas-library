import { collection, FirestoreDataConverter, getDocs, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { db } from "../firebase";
import type { CustomNode, CustomNodeCode } from "../interfaces"

const CustomNodeCollection = "custom_nodes";
const CustomNodeCodeCollection = "custom_node_codes";

const nodeConverter: FirestoreDataConverter<CustomNode> = ({
  toFirestore: (data: CustomNode) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    snap.data() as CustomNode
})

const nodeCodeConverter: FirestoreDataConverter<CustomNodeCode> = ({
  toFirestore: (data: CustomNodeCode) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as CustomNodeCode
})

export async function getCustomNodes(): Promise<CustomNode[]> {
  const nodeCollection = collection(db, CustomNodeCollection).withConverter(nodeConverter);
  const nodeSnapshot = await getDocs(nodeCollection);
  const nodeList = nodeSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id} as CustomNode));
  return nodeList;
}

export async function getCustomNodeCode(id: string) : Promise<CustomNodeCode> {
  const nodeCodeCollection = collection(db, CustomNodeCodeCollection).withConverter(nodeCodeConverter);
  const q = query(nodeCodeCollection, where("node_id", "==", id));
  const nodeCodeSnapshot = await getDocs(q);
  const nodeCode = nodeCodeSnapshot.docs[0];
  return nodeCode?.data();
}
