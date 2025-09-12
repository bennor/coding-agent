import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ThinkingLogsProps {
  logs: string[];
  isLoading: boolean;
  showInResults?: boolean;
}

export function ThinkingLogs({
  logs,
  isLoading,
  showInResults = false,
}: ThinkingLogsProps) {
  const [showLogs, setShowLogs] = useState(false);
  const logsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added (only during loading)
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to scroll when logs change
  useEffect(() => {
    if (isLoading && logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs.length, isLoading]);

  if (logs.length === 0) {
    return null;
  }

  // Active progress display (during loading)
  if (isLoading && !showInResults) {
    return (
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <h4 className="font-semibold text-blue-800">Processing...</h4>
          </div>
          <div
            ref={logsRef}
            className="space-y-3 max-h-40 overflow-y-auto scroll-smooth"
          >
            {logs.map((log, index) => (
              <div
                key={`active-${index}-${log.slice(0, 20)}`}
                className="text-base text-blue-700 flex items-center gap-3"
              >
                <span className="text-blue-500 text-lg">•</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Collapsible display (in results)
  if (showInResults) {
    return (
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowLogs(!showLogs)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showLogs ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          {showLogs ? "Hide" : "Show"} processing steps ({logs.length})
        </button>

        {showLogs && (
          <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {logs.map((log, index) => (
                <div
                  key={`completed-${index}-${log.slice(0, 20)}`}
                  className="text-sm text-blue-700 flex items-center gap-3"
                >
                  <span className="text-blue-400">•</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
