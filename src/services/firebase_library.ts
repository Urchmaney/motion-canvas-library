import { addDoc, collection, doc, Firestore, FirestoreDataConverter, getDoc, getDocs, query, QueryDocumentSnapshot, where } from "firebase/firestore";
// import { db } from "../firebase";
import type { CustomNode, CustomNodeCode } from "../interfaces"

export default class FirebaseLibrary {
  private readonly CustomNodeCollection = "custom_nodes";
  private readonly CustomNodeCodeCollection = "custom_node_codes";
  private readonly nodeConverter: FirestoreDataConverter<CustomNode> = ({
    toFirestore: (data: CustomNode) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
      snap.data() as CustomNode
  });

  private readonly nodeCodeConverter: FirestoreDataConverter<CustomNodeCode> = ({
    toFirestore: (data: CustomNodeCode) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as CustomNodeCode
  })

  constructor(private db: Firestore) {}

  async getCustomNode(id: string): Promise<CustomNode | null> {
    const docRef = doc(this.db, this.CustomNodeCollection, id).withConverter(this.nodeConverter);
    const document = await getDoc(docRef);
    if (document.exists()) return { ...document.data(), id: document.id };
    return null;
  }
  
  async  getCustomNodeCode(id: string): Promise<CustomNodeCode> {
    const nodeCodeCollection = collection(this.db, this.CustomNodeCodeCollection).withConverter(this.nodeCodeConverter);
    const q = query(nodeCodeCollection, where("node_id", "==", id));
    const nodeCodeSnapshot = await getDocs(q);
    const nodeCode = nodeCodeSnapshot.docs[0];
    return nodeCode?.data();
  }
  

  async getCustomNodes(): Promise<CustomNode[]> {
    const nodeCollection = collection(this.db, this.CustomNodeCollection).withConverter(this.nodeConverter);
    const nodeSnapshot = await getDocs(nodeCollection);
    const nodeList = nodeSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CustomNode));
    return nodeList;
  }
  
  async addCustomNodeCode(code: CustomNodeCode) {
    const nodeCode = await this.getCustomNodeCode(code.node_id);
    if (nodeCode) throw "Custom Node already exists";
  
    const nodeCodeCollection = collection(this.db, this.CustomNodeCodeCollection).withConverter(this.nodeCodeConverter);
    await addDoc(nodeCodeCollection, code);
  } 
}

// export default new FirebaseLibrary(db)