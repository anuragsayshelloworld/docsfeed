import { useState, useEffect, useRef } from "react";
import { Copy } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef();

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-900 text-white rounded-lg overflow-hidden my-4 px-4">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 text-gray-400 hover:text-white text-sm flex items-center gap-1"
      >
        <Copy size={14} /> {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="p-4 overflow-x-auto">
        <code ref={codeRef}>{code}</code>
      </pre>
    </div>
  );
}
