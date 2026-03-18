"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [readme, setReadme] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setReadme("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate README");
      }

      const data = await res.json();
      setReadme(data.readme);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(readme);
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-950 font-sans text-zinc-100">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-8 py-16 px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">ReadMeAI</h1>
          <p className="text-zinc-400">
            Paste your code or describe your project. Get a polished README.md
            instantly.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your code here, or describe what your project does..."
            className="h-48 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />

          <button
            onClick={generate}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-white px-6 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate README"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {readme && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Generated README.md</h2>
              <button
                onClick={copyToClipboard}
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Copy
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200">
              {readme}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
