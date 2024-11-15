import { useEffect, useState } from "react"
import { CopyIcon } from "./icons"
import Editor from "./Editor";

export const CodeDisplay = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const copyTopClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  }

  useEffect(() => {
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }, [copied])


  return (
    <div className="">
      <div className="flex justify-end p-2 py-4">
        <span className="cursor-pointer" onClick={copyTopClipboard}><CopyIcon size={24} fill={copied ? "#000": ""} /></span>
      </div>
      <div className="w-full overflow-x-scroll overflow-y-scroll relative py-3 px-5 pt-2 bg-no-repeat  bg-cover h-[1000px] max-h-[700px]">
        <div className="w-[600px]">
          <Editor code={code} editable={false} />
        </div>
      </div>
    </div>
  )
}
