import { useState } from "react";
import Editor from "./Editor";

export default function CodeEditor() {
  const [code, setCode] = useState("");
  return (
    <div className="w-full">
      <Editor code={code} onCodeChange={setCode} />
    </div>
  )
}