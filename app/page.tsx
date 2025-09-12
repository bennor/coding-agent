"use client";

import {
  AlertCircle,
  Github,
  Loader2,
  Send,
  Settings,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";

export default function Home() {
  const repoUrlId = useId();
  const githubTokenId = useId();
  const promptId = useId();
  const [step, setStep] = useState<"repository" | "prompt">("prompt");
  const [repositoryConfig, setRepositoryConfig] = useState({
    repoUrl: "https://github.com/bennor/coding-agent",
    githubToken: "",
  });
  const [prompt, setPrompt] = useState(
    "Explain what the code in this repository does."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRepositoryConfigChange = (
    field: keyof typeof repositoryConfig,
    value: string
  ) => {
    setRepositoryConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.select();
  };

  const handleRepositorySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!repositoryConfig.repoUrl.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    if (!repositoryConfig.repoUrl.startsWith("https://github.com/")) {
      setError("Repository URL must start with https://github.com/");
      return;
    }

    setError(null);
    setStep("prompt");
  };

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={part}
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

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          repoUrl: repositoryConfig.repoUrl,
          githubToken: repositoryConfig.githubToken || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result.response);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
            <Sparkles className="h-4 w-4" />
            AI-Powered Code Agent
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-gray-900">
            Coding Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your GitHub repositories with intelligent automation.
            Submit a prompt and let our AI agent process, review, and enhance
            your codebase.
          </p>
        </div>

        {/* Repository Configuration Step */}
        {step === "repository" && (
          <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-lg">
            <div className="p-8 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Configure Repository
              </h2>
              <p className="text-base text-gray-600">
                First, let's set up which repository you'd like to work with
              </p>
            </div>
            <div className="px-8 pb-8">
              <form onSubmit={handleRepositorySubmit} className="space-y-6">
                {/* Repository URL Field */}
                <div className="space-y-3">
                  <label
                    htmlFor={repoUrlId}
                    className="text-base font-medium text-gray-900 flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Repository URL *
                  </label>
                  <input
                    id={repoUrlId}
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={repositoryConfig.repoUrl}
                    onChange={(e) =>
                      handleRepositoryConfigChange("repoUrl", e.target.value)
                    }
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
                    value={repositoryConfig.githubToken}
                    onChange={(e) =>
                      handleRepositoryConfigChange(
                        "githubToken",
                        e.target.value
                      )
                    }
                    onFocus={handleFocus}
                    className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                  <p className="text-sm text-gray-500 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    Required for private repositories. Your token is encrypted
                    and never stored.
                  </p>
                </div>

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
        )}

        {/* Prompt Step */}
        {step === "prompt" && (
          <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-lg">
            <div className="p-8 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Submit Request
              </h2>
              <div className="flex items-center gap-2 text-base text-gray-600 mb-4">
                <span>Repository:</span>
                <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-2">
                  <Github className="h-4 w-4 text-gray-600" />
                  <span className="font-mono text-sm">
                    {repositoryConfig.repoUrl.replace(
                      "https://github.com/",
                      ""
                    )}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setStep("repository")}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Change repository"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="px-8 pb-8">
              <form onSubmit={handlePromptSubmit} className="space-y-6">
                {/* Prompt Field */}
                <div className="space-y-3">
                  <label
                    htmlFor={promptId}
                    className="block text-base font-medium text-gray-900"
                  >
                    Prompt *
                  </label>
                  <textarea
                    id={promptId}
                    placeholder="Example: Analyze the codebase for security vulnerabilities and suggest improvements..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={handleFocus}
                    className="w-full min-h-[140px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full h-14 px-8 text-base font-semibold text-white bg-black rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Computing...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Execute Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
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
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono overflow-x-auto text-gray-800">
                  {renderTextWithLinks(result)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Powered by</span>
            <Image
              src="/vercel-logo.svg"
              alt="Vercel"
              width={2048}
              height={407}
              className="h-4 w-auto opacity-75"
              unoptimized
            />
          </div>
        </div>
      </div>
    </main>
  );
}
