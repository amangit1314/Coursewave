"use client";

import { useState } from "react";
import { generateJSON } from "@/lib/ai/gemini";
import {
  Sparkles,
  Bot,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type AISummaryProps = {
  videoUrl: string;
  videoTitle?: string;
  duration?: number;
};

type SummaryState = "idle" | "transcribing" | "generating" | "success" | "error";

const AISummary = ({ videoUrl, videoTitle, duration }: AISummaryProps) => {
  const [state, setState] = useState<SummaryState>("idle");
  const [summary, setSummary] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");

  const handleGenerateSummary = async () => {
    try {
      setState("transcribing");
      setError(null);
      setTranscript("");
      setSummary(null);

      // Step 1: Transcribe video via AssemblyAI
      const transcriptRes = await fetch("/api/videos/process-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });

      if (!transcriptRes.ok) {
        const errData = await transcriptRes.json();
        throw new Error(errData.error || "Failed to transcribe video");
      }

      const transcriptData = await transcriptRes.json();
      if (!transcriptData.success || !transcriptData.transcript) {
        throw new Error("No transcript generated");
      }

      setTranscript(transcriptData.transcript);

      // Step 2: Generate summary from transcript via Gemini
      setState("generating");

      const prompt = `Analyze this video transcript and create a comprehensive summary.

VIDEO: ${videoTitle || "Untitled"}
DURATION: ${duration ? `${Math.ceil(duration / 60)} minutes` : "Unknown"}

TRANSCRIPT:
${transcriptData.transcript}

Provide 5-7 key bullet points covering:
1. Specific techniques or concepts taught
2. Practical applications
3. Step-by-step processes explained
4. Important technical details
5. Key takeaways for implementation

Format as a JSON array of strings: ["point 1", "point 2", ...]`;

      const points = await generateJSON<string[]>(prompt);
      setSummary(Array.isArray(points) ? points.slice(0, 7) : [String(points)]);
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate summary");
      setState("error");
    }
  };

  const handleRegenerate = () => {
    setSummary(null);
    setTranscript("");
    setError(null);
    setState("idle");
  };

  const stateConfig = getStateConfig(state, error);
  const StateIcon = stateConfig.icon;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-900/80">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-2 transition-colors ${stateConfig.bgClass}`}>
            <StateIcon className={`text-lg ${stateConfig.iconClass}`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {stateConfig.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stateConfig.description}
            </p>
          </div>
        </div>

        {state === "success" && (
          <Button variant="outline" size="sm" onClick={handleRegenerate} className="flex items-center gap-2">
            <RefreshCw size={14} />
            New Summary
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {state === "idle" && <IdleView onGenerate={handleGenerateSummary} />}

          {(state === "transcribing" || state === "generating") && (
            <LoadingView state={state} />
          )}

          {state === "success" && summary && (
            <SuccessView
              summary={summary}
              videoTitle={videoTitle}
              duration={duration}
              transcript={transcript}
            />
          )}

          {state === "error" && (
            <ErrorView
              error={error}
              onReset={handleRegenerate}
              onRetry={handleGenerateSummary}
            />
          )}
        </AnimatePresence>
      </div>

      {(state === "idle" || state === "success") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700"
        >
          <p className="text-xs text-gray-500 text-center">
            Powered by AssemblyAI & Google Gemini
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AISummary;

// --- Sub-components ---

function getStateConfig(state: SummaryState, error: string | null) {
  switch (state) {
    case "transcribing":
      return { icon: RefreshCw, iconClass: "text-blue-500 animate-spin", bgClass: "bg-blue-50 dark:bg-blue-900/20", title: "Transcribing Video", description: "Converting speech to text..." };
    case "generating":
      return { icon: RefreshCw, iconClass: "text-purple-500 animate-spin", bgClass: "bg-purple-50 dark:bg-purple-900/20", title: "Generating Summary", description: "Analyzing content with AI..." };
    case "success":
      return { icon: CheckCircle2, iconClass: "text-green-500", bgClass: "bg-green-50 dark:bg-green-900/20", title: "AI Summary Generated", description: "Key insights from this video" };
    case "error":
      return { icon: AlertCircle, iconClass: "text-red-500", bgClass: "bg-red-50 dark:bg-red-900/20", title: "Generation Failed", description: error || "Something went wrong" };
    default:
      return { icon: Bot, iconClass: "text-purple-500", bgClass: "bg-purple-50 dark:bg-purple-900/20", title: "AI Video Summary", description: "Get intelligent insights using AI" };
  }
}

function IdleView({ onGenerate }: { onGenerate: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
      <div className="mb-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 p-4 dark:from-purple-900/20 dark:to-blue-900/20 w-fit mx-auto">
        <Sparkles className="text-2xl text-purple-600 dark:text-purple-400" />
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Generate AI-powered insights from any video. We&apos;ll transcribe the audio and extract key takeaways.
      </p>
      <Button onClick={onGenerate} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm hover:shadow-md transition-all" size="lg">
        <Sparkles className="mr-2" size={16} />
        Generate AI Summary
      </Button>
    </motion.div>
  );
}

function LoadingView({ state }: { state: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-8">
      <div className="mb-6 space-y-3">
        <div className="mx-auto h-4 w-48 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse" />
        <div className="mx-auto h-3 w-32 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {state === "transcribing" ? "Transcribing audio... This may take a few minutes." : "Analyzing transcript with AI..."}
      </p>
      <div className="space-y-2 max-w-md mx-auto">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse" />
            <div className="h-3 flex-1 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SuccessView({ summary, videoTitle, duration, transcript }: { summary: string[]; videoTitle?: string; duration?: number; transcript: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p className="text-sm text-green-700 dark:text-green-300">
          <strong>Video:</strong> {videoTitle || "Untitled"}
          {duration && ` \u2022 ${Math.ceil(duration / 60)}min`}
          {transcript && ` \u2022 ${Math.ceil(transcript.split(" ").length / 200)}min read`}
        </p>
      </div>
      <ul className="space-y-3">
        {summary.map((point, index) => (
          <motion.li key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-start gap-3 rounded-lg bg-gray-50/50 p-3 dark:bg-zinc-800/50">
            <div className="mt-1 rounded-full bg-green-100 p-1 dark:bg-green-900/30">
              <CheckCircle2 size={12} className="text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{point}</span>
          </motion.li>
        ))}
      </ul>

      {transcript && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Transcript Preview</h4>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 line-clamp-3">
            {transcript.substring(0, 200)}...
          </p>
        </div>
      )}
    </motion.div>
  );
}

function ErrorView({ error, onReset, onRetry }: { error: string | null; onReset: () => void; onRetry: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-8">
      <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
      <p className="text-gray-600 dark:text-gray-400 mb-4">{error || "Unable to generate summary."}</p>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onReset}>Try Again</Button>
        <Button onClick={onRetry} className="bg-gradient-to-r from-purple-500 to-blue-500">
          <RefreshCw className="mr-2" size={14} />
          Retry
        </Button>
      </div>
    </motion.div>
  );
}
