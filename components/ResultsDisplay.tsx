import { Sparkles } from "lucide-react";
import { ThinkingLogs } from "./ThinkingLogs";
import Markdown from 'react-markdown';

interface ResultsDisplayProps {
  result: string;
  thinkingLogs: string[];
}

export function ResultsDisplay({ result, thinkingLogs }: ResultsDisplayProps) {
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={`${index}-${part}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
      <div className="p-8 pb-6">
        <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6" />
          Agent Response
        </h3>
        <p className="text-base text-gray-600">
          Here's what the AI agent has computed
        </p>
      </div>
      <div className="px-8 pb-8">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="prose max-w-none text-sm leading-relaxed overflow-x-auto text-gray-800 markdown-body" style={{fontFamily: 'inherit'}}>
            <Markdown>{result}</Markdown>
          </div>
        </div>

        <ThinkingLogs
          logs={thinkingLogs}
          isLoading={false}
          showInResults={true}
        />
      </div>
    </div>
  );
}
