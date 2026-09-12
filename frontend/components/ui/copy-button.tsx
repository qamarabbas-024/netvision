"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({ code, className }: { code: string; className?: string }) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) return;
    const timeout = setTimeout(() => {
      setHasCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  return (
    <button
      type="button"
      className={cn(
        "relative z-10 flex h-7 w-7 items-center justify-center rounded-md border bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 transition-all duration-150 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 before:absolute before:-inset-2 before:content-['']",
        className
      )}
      aria-label={hasCopied ? "Copied to clipboard" : "Copy code snippet"}
      onClick={() => {
        navigator.clipboard.writeText(code);
        setHasCopied(true);
      }}
    >
      <span className="sr-only">{hasCopied ? "Copied" : "Copy"}</span>
      {hasCopied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400 transition-transform scale-110" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
