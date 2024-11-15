import Editor from "react-simple-code-editor";
import Prism from "prismjs"
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-clike';
import 'prismjs/themes/prism.css';

Prism.manual = true;

export default function CEditor({ code, editable=true, onCodeChange = (_) => {} }: { code: string, editable?: boolean, onCodeChange?: (code: string)=> void }) {
  return (
    <Editor
      value={code}
      onValueChange={onCodeChange}
      disabled={!editable}
      highlight={code => Prism.highlight(code, Prism.languages.js, "js")}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 15,
        minHeight: 400
      }}
      className="focus-visible:outline-none"
    />
  )
}