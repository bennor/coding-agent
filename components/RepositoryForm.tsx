import { AlertCircle, Github, Send } from "lucide-react";
import { useId } from "react";

export interface RepositoryConfig {
  repoUrl: string;
  githubToken: string;
}

interface RepositoryFormProps {
  config: RepositoryConfig;
  onChange: (field: keyof RepositoryConfig, value: string) => void;
  onSubmit: () => void;
  error?: string | null;
}

export function RepositoryForm({
  config,
  onChange,
  onSubmit,
  error,
}: RepositoryFormProps) {
  const repoUrlId = useId();
  const githubTokenId = useId();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-lg">
      <div className="p-8 pb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Configure Repository
        </h2>
        <p className="text-base text-gray-600">
          Let's set up which repository you'd like to work with
        </p>
      </div>
      <div className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Repository URL Field */}
          <div className="space-y-3">
            <label
              htmlFor={repoUrlId}
              className="block text-base font-medium text-gray-900 flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              GitHub Repository URL *
            </label>
            <input
              id={repoUrlId}
              type="url"
              placeholder="https://github.com/username/repository"
              value={config.repoUrl}
              onChange={(e) => onChange("repoUrl", e.target.value)}
              onFocus={handleFocus}
              className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* GitHub Token Field */}
          <div className="space-y-3">
            <label
              htmlFor={githubTokenId}
              className="block text-base font-medium text-gray-900"
            >
              GitHub Personal Access Token (Optional)
            </label>
            <input
              id={githubTokenId}
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={config.githubToken}
              onChange={(e) => onChange("githubToken", e.target.value)}
              onFocus={handleFocus}
              className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
            <p className="text-sm text-gray-500 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Required for private repositories. Your token is encrypted and
              never stored.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full h-12 px-8 text-base font-semibold text-white bg-black rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            Continue
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
