import React from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { TheoryBlock } from '@/types/learning';

export const TheoryBlockComponent: React.FC<{ block: TheoryBlock }> = ({ block }) => {
  return (
    <Card className="p-8 flex flex-col gap-6">
      {block.title ? <h2 className="text-xl font-bold text-white tracking-tight">{block.title}</h2> : null}

      <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
        {block.contentMarkdown}
      </div>

      {block.codeSnippet ? (
        <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono text-xs text-[#00f0ff]">
          <span className="text-zinc-500 block text-[10px] mb-2 uppercase">{block.codeSnippet.language} SNIPPET</span>
          <pre className="overflow-x-auto">{block.codeSnippet.code}</pre>
        </div>
      ) : null}

      {block.keyTakeaway ? (
        <Alert variant="info" title="Key Takeaway">
          {block.keyTakeaway}
        </Alert>
      ) : null}
    </Card>
  );
};
