import { useEffect, useRef, useState } from 'react';
import { Copy } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps): JSX.Element {
  const codeRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code]);

  const copyCode = async (): Promise<void> => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950 px-4 text-slate-100">
      <button
        type="button"
        onClick={copyCode}
        className="absolute right-3 top-3 flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-slate-100"
      >
        <Copy size={14} />
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="overflow-x-auto p-4">
        <code ref={codeRef}>{code}</code>
      </pre>
    </div>
  );
}
