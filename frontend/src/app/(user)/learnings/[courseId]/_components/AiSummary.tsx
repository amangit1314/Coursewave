// "use client";

// import { useState } from "react";
// import {
//   ListChecks,
//   Sparkles,
//   Bot,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { motion, AnimatePresence } from "framer-motion";

// type AISummaryProps = {
//   videoUrl: string;
//   videoTitle?: string;
//   duration?: number;
// };

// type SummaryState = "idle" | "loading" | "success" | "error";

// const AISummary = ({ videoUrl, videoTitle, duration }: AISummaryProps) => {
//   const [state, setState] = useState<SummaryState>("idle");
//   const [summary, setSummary] = useState<string[] | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleGenerateSummary = async () => {
//     try {
//       setState("loading");
//       setError(null);

//       // Simulate API call with timeout
//       const timeoutPromise = new Promise((_, reject) =>
//         setTimeout(() => reject(new Error("Request timeout")), 30000)
//       );

//       const apiPromise = fetch("/api/ai/summary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           videoUrl,
//           videoTitle,
//           duration,
//           timestamp: new Date().toISOString(),
//         }),
//       });

//       const res = (await Promise.race([
//         apiPromise,
//         timeoutPromise,
//       ])) as Response;

//       if (!res.ok) {
//         throw new Error(`API error: ${res.status}`);
//       }

//       const data = await res.json();

//       if (data.success && data.summary?.length > 0) {
//         setSummary(data.summary);
//         setState("success");
//       } else {
//         throw new Error(data.error || "No summary generated");
//       }
//     } catch (err) {
//       console.error("Error generating summary:", err);
//       setError(
//         err instanceof Error ? err.message : "Failed to generate summary"
//       );
//       setState("error");
//     }
//   };

//   const handleRegenerate = () => {
//     setSummary(null);
//     setError(null);
//     setState("idle");
//   };

//   const getStateConfig = () => {
//     switch (state) {
//       case "loading":
//         return {
//           icon: RefreshCw,
//           iconClass: "text-blue-500 animate-spin",
//           bgClass: "bg-blue-50 dark:bg-blue-900/20",
//           title: "Generating AI Summary",
//           description: "Analyzing video content...",
//         };
//       case "success":
//         return {
//           icon: CheckCircle2,
//           iconClass: "text-green-500",
//           bgClass: "bg-green-50 dark:bg-green-900/20",
//           title: "AI Summary Generated",
//           description: `Key points from the video`,
//         };
//       case "error":
//         return {
//           icon: AlertCircle,
//           iconClass: "text-red-500",
//           bgClass: "bg-red-50 dark:bg-red-900/20",
//           title: "Generation Failed",
//           description: error || "Something went wrong",
//         };
//       default:
//         return {
//           icon: Bot,
//           iconClass: "text-purple-500",
//           bgClass: "bg-purple-50 dark:bg-purple-900/20",
//           title: "AI Summary",
//           description: "Get intelligent insights from this video",
//         };
//     }
//   };

//   const stateConfig = getStateConfig();
//   const StateIcon = stateConfig.icon;

//   return (
//     <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-900/80">
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div
//             className={`rounded-xl p-2 transition-colors ${stateConfig.bgClass}`}
//           >
//             <StateIcon className={`text-lg ${stateConfig.iconClass}`} />
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
//               {stateConfig.title}
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {stateConfig.description}
//             </p>
//           </div>
//         </div>

//         {state === "success" && (
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleRegenerate}
//             className="flex items-center gap-2"
//           >
//             <RefreshCw size={14} />
//             Regenerate
//           </Button>
//         )}
//       </div>

//       {/* Content Area */}
//       <div className="space-y-4">
//         <AnimatePresence mode="wait">
//           {state === "idle" && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="text-center"
//             >
//               <div className="mb-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 p-4 dark:from-purple-900/20 dark:to-blue-900/20 w-fit mx-auto">
//                 <Sparkles className="text-2xl text-purple-600 dark:text-purple-400" />
//               </div>
//               <p className="text-gray-600 dark:text-gray-400 mb-6">
//                 Generate intelligent insights and key takeaways from this video
//                 using AI.
//               </p>
//               <Button
//                 onClick={handleGenerateSummary}
//                 className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm hover:shadow-md hover:shadow-purple-500/25 transition-all"
//                 size="lg"
//               >
//                 <Sparkles className="mr-2" size={16} />
//                 Generate AI Summary
//               </Button>
//             </motion.div>
//           )}

//           {state === "loading" && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="text-center py-8"
//             >
//               <div className="mb-4 animate-pulse">
//                 <div className="mx-auto mb-2 h-4 w-32 rounded-full bg-gray-200 dark:bg-zinc-700"></div>
//                 <div className="mx-auto h-3 w-24 rounded-full bg-gray-200 dark:bg-zinc-700"></div>
//               </div>
//               <div className="space-y-2">
//                 {[...Array(3)].map((_, i) => (
//                   <div key={i} className="flex items-center gap-3">
//                     <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse"></div>
//                     <div
//                       className="h-3 flex-1 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse"
//                       style={{ animationDelay: `${i * 0.1}s` }}
//                     ></div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {state === "success" && summary && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <ul className="space-y-3">
//                 {summary.map((point, index) => (
//                   <motion.li
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="flex items-start gap-3 rounded-lg bg-gray-50/50 p-3 dark:bg-zinc-800/50"
//                   >
//                     <div className="mt-1 rounded-full bg-green-100 p-1 dark:bg-green-900/30">
//                       <CheckCircle2
//                         size={12}
//                         className="text-green-600 dark:text-green-400"
//                       />
//                     </div>
//                     <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
//                       {point}
//                     </span>
//                   </motion.li>
//                 ))}
//               </ul>
//             </motion.div>
//           )}

//           {state === "error" && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="text-center py-8"
//             >
//               <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
//               <p className="text-gray-600 dark:text-gray-400 mb-4">
//                 {error || "Unable to generate summary at this time."}
//               </p>
//               <div className="flex gap-3 justify-center">
//                 <Button
//                   variant="outline"
//                   onClick={handleRegenerate}
//                   className="border-gray-300"
//                 >
//                   Try Again
//                 </Button>
//                 <Button
//                   onClick={handleGenerateSummary}
//                   className="bg-gradient-to-r from-purple-500 to-blue-500"
//                 >
//                   <RefreshCw className="mr-2" size={14} />
//                   Retry
//                 </Button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Footer Info */}
//       {(state === "idle" || state === "success") && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700"
//         >
//           <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
//             Powered by AI • Summarizes key concepts •{" "}
//             {duration
//               ? `${Math.ceil(duration / 60)}min video`
//               : "Video analysis"}
//           </p>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default AISummary;
"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
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

type SummaryState =
  | "idle"
  | "transcribing"
  | "generating"
  | "success"
  | "error";

const AISummary = ({ videoUrl, videoTitle, duration }: AISummaryProps) => {
  const [state, setState] = useState<SummaryState>("idle");
  const [summary, setSummary] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");

  const generateSummaryFromTranscript = async (
    transcriptText: string,
    title?: string
  ) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
    });

    const prompt = `Analyze this video transcript and create a comprehensive summary with practical, actionable insights.

VIDEO: ${title || "Untitled"}
DURATION: ${duration ? `${Math.ceil(duration / 60)} minutes` : "Unknown"}
URL: ${videoUrl}

TRANSCRIPT:
${transcriptText}

Please provide 5-7 key bullet points that capture:
1. Specific techniques, methods, or programming concepts taught
2. Practical applications and real-world uses
3. Step-by-step processes explained
4. Important code snippets, formulas, or technical details
5. Key takeaways for implementation
6. Common pitfalls or best practices mentioned

Focus on concrete, actionable content. If this is a programming video, extract actual code patterns, frameworks, or technical concepts discussed.

Format the response as a JSON array of strings exactly like this:
["First key point here", "Second key point here", "Third key point here"]`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const responseText = result.response.text();

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      // Fallback: if JSON parsing fails, try to extract bullet points
      console.log("JSON parsing failed, extracting from text:", responseText);
      const points = responseText
        .split("\n")
        .filter((line) => {
          const trimmed = line.trim();
          return (
            (trimmed.startsWith("-") ||
              trimmed.startsWith("•") ||
              trimmed.startsWith("*") ||
              /^\d+\./.test(trimmed)) &&
            trimmed.length > 10
          );
        })
        .map((line) => line.replace(/^[-•*\d.\s]+/, "").trim())
        .filter((point) => point.length > 0);

      return points.length > 0 ? points : [responseText];
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setState("transcribing");
      setError(null);
      setTranscript("");
      setSummary(null);

      // Step 1: Get transcript using AssemblyAI
      console.log("Starting transcription for:", videoUrl);
      const transcriptResponse = await fetch("/api/videos/process-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl: videoUrl,
        }),
      });

      if (!transcriptResponse.ok) {
        const errorData = await transcriptResponse.json();
        throw new Error(errorData.error || "Failed to transcribe video");
      }

      const transcriptData = await transcriptResponse.json();

      if (!transcriptData.success || !transcriptData.transcript) {
        throw new Error("No transcript generated");
      }

      setTranscript(transcriptData.transcript);
      console.log(
        "Transcript received, length:",
        transcriptData.transcript.length
      );

      // Step 2: Generate summary from transcript
      setState("generating");
      const summaryPoints = await generateSummaryFromTranscript(
        transcriptData.transcript,
        videoTitle
      );

      setSummary(
        Array.isArray(summaryPoints)
          ? summaryPoints.slice(0, 7)
          : [summaryPoints]
      );
      setState("success");
    } catch (err) {
      console.error("Error generating summary:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate summary"
      );
      setState("error");
    }
  };

  const handleRegenerate = () => {
    setSummary(null);
    setTranscript("");
    setError(null);
    setState("idle");
  };

  const getStateConfig = () => {
    switch (state) {
      case "transcribing":
        return {
          icon: RefreshCw,
          iconClass: "text-blue-500 animate-spin",
          bgClass: "bg-blue-50 dark:bg-blue-900/20",
          title: "Transcribing Video",
          description: "Converting speech to text...",
        };
      case "generating":
        return {
          icon: RefreshCw,
          iconClass: "text-purple-500 animate-spin",
          bgClass: "bg-purple-50 dark:bg-purple-900/20",
          title: "Generating Summary",
          description: "Analyzing content with AI...",
        };
      case "success":
        return {
          icon: CheckCircle2,
          iconClass: "text-green-500",
          bgClass: "bg-green-50 dark:bg-green-900/20",
          title: "AI Summary Generated",
          description: `Key insights from this video`,
        };
      case "error":
        return {
          icon: AlertCircle,
          iconClass: "text-red-500",
          bgClass: "bg-red-50 dark:bg-red-900/20",
          title: "Generation Failed",
          description: error || "Something went wrong",
        };
      default:
        return {
          icon: Bot,
          iconClass: "text-purple-500",
          bgClass: "bg-purple-50 dark:bg-purple-900/20",
          title: "AI Video Summary",
          description: "Get intelligent insights using AI",
        };
    }
  };

  const stateConfig = getStateConfig();
  const StateIcon = stateConfig.icon;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-900/80">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-xl p-2 transition-colors ${stateConfig.bgClass}`}
          >
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            className="flex items-center gap-2"
          >
            <RefreshCw size={14} />
            New Summary
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="mb-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 p-4 dark:from-purple-900/20 dark:to-blue-900/20 w-fit mx-auto">
                <Sparkles className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Generate AI-powered insights from any video. We'll automatically
                transcribe the audio and analyze the content to extract key
                techniques and practical takeaways.
              </p>
              <Button
                onClick={handleGenerateSummary}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm hover:shadow-md hover:shadow-purple-500/25 transition-all"
                size="lg"
              >
                <Sparkles className="mr-2" size={16} />
                Generate AI Summary
              </Button>
            </motion.div>
          )}

          {(state === "transcribing" || state === "generating") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <div className="mb-6 space-y-3">
                <div className="mx-auto h-4 w-48 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse"></div>
                <div className="mx-auto h-3 w-32 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse"></div>
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                {state === "transcribing" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Transcribing audio... This may take a few minutes.
                  </p>
                )}
                {state === "generating" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Analyzing transcript with AI...
                  </p>
                )}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse"></div>
                    <div
                      className="h-3 flex-1 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {state === "success" && summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Video:</strong> {videoTitle || "Untitled"}
                  {duration && ` • ${Math.ceil(duration / 60)}min`}
                  {transcript &&
                    ` • ${Math.ceil(transcript.split(" ").length / 200)}min read`}
                </p>
              </div>
              <ul className="space-y-3">
                {summary.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 rounded-lg bg-gray-50/50 p-3 dark:bg-zinc-800/50"
                  >
                    <div className="mt-1 rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                      <CheckCircle2
                        size={12}
                        className="text-green-600 dark:text-green-400"
                      />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Transcript Preview */}
              {transcript && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText
                      size={16}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Transcript Preview
                    </h4>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 line-clamp-3">
                    {transcript.substring(0, 200)}...
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error || "Unable to generate summary at this time."}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  className="border-gray-300"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleGenerateSummary}
                  className="bg-gradient-to-r from-purple-500 to-blue-500"
                >
                  <RefreshCw className="mr-2" size={14} />
                  Retry
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      {(state === "idle" || state === "success") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700"
        >
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            Powered by AssemblyAI & Google Gemini • Automatic transcription •
            Practical insights
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AISummary;
