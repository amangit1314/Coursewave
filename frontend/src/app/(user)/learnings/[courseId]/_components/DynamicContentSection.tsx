import React from "react";
import DOMPurify from "dompurify";
import { VideoPlayer } from "@/components/common/VideoPlayer";
import { Chapter } from "@/types/course-details-api-response";
import toast from "react-hot-toast";

import { FileText, HelpCircle, Video } from "lucide-react";

const DynamicContentSection = ({
  activeChapter,
  onChapterComplete,
}: {
  activeChapter: Chapter;
  onChapterComplete?: (chapterId: string) => void;
}) => {
  // Normalize content type to lowercase
  const contentType = (activeChapter?.contentType || "video").toLowerCase();

  // Content info mapping for UI metadata
  const getContentInfo = () => {
    switch (contentType) {
      case "text":
        return {
          icon: FileText,
          title: "Chapter Content",
          gradient: "from-emerald-500 to-teal-600",
          description: "Reading material",
        };
      case "quiz":
        return {
          icon: HelpCircle,
          title: "Chapter Quiz",
          gradient: "from-purple-500 to-pink-600",
          description: "Test your knowledge",
        };
      case "audio":
        return {
          icon: Video, // You can replace with a dedicated audio icon if import available
          title: "Audio Lesson",
          gradient: "from-yellow-500 to-orange-600",
          description: "Audio lesson",
        };
      case "video":
      default:
        return {
          icon: Video,
          title: "Chapter Video",
          gradient: "from-blue-500 to-indigo-600",
          description: "Video lesson",
        };
    }
  };

  const contentInfo = getContentInfo();
  const IconComponent = contentInfo.icon;

  // Text content UI — sanitize HTML to prevent XSS
  const TextContent = ({ content }: { content: string }) => {
    const sanitized = typeof window !== "undefined"
      ? DOMPurify.sanitize(content)
      : content;
    return (
      <div className="prose dark:prose-invert max-w-none p-6">
        <div dangerouslySetInnerHTML={{ __html: sanitized }} />
      </div>
    );
  };

  // Quiz content UI with grading
  const QuizContent = ({ quizData, onPass }: { quizData: any; onPass?: () => void }) => {
    const [answers, setAnswers] = React.useState<Record<number, string>>({});
    const [submitted, setSubmitted] = React.useState(false);
    const [score, setScore] = React.useState(0);

    const questions = quizData?.questions || [];
    const passingScore = 70;

    const handleSubmit = () => {
      if (Object.keys(answers).length < questions.length) {
        toast.error("Please answer all questions before submitting");
        return;
      }

      let earned = 0;
      let total = 0;
      questions.forEach((q: any, idx: number) => {
        const points = q.points || 1;
        total += points;
        const userAnswer = answers[idx];
        // Support both "correctAnswer" (instructor format) and "correctIndex"
        const correct = q.correctAnswer || q.options?.[q.correctIndex];
        if (userAnswer === correct) {
          earned += points;
        }
      });

      const percentage = total > 0 ? Math.round((earned / total) * 100) : 0;
      setScore(percentage);
      setSubmitted(true);

      if (percentage >= passingScore) {
        toast.success(`Passed! Score: ${percentage}%`);
        onPass?.();
      } else {
        toast.error(`Score: ${percentage}%. You need ${passingScore}% to pass.`);
      }
    };

    const handleRetry = () => {
      setAnswers({});
      setSubmitted(false);
      setScore(0);
    };

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Quiz — {questions.length} question{questions.length !== 1 ? "s" : ""}
          </h3>
          {quizData?.totalPoints && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {quizData.totalPoints} points total
            </span>
          )}
        </div>

        {questions.map((question: any, idx: number) => {
          const userAnswer = answers[idx];
          const correct = question.correctAnswer || question.options?.[question.correctIndex];
          const isCorrect = submitted && userAnswer === correct;
          const isWrong = submitted && userAnswer && userAnswer !== correct;

          return (
            <div
              key={question.id || idx}
              className={`rounded-xl border p-5 transition-colors ${
                submitted
                  ? isCorrect
                    ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                    : isWrong
                      ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
                      : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                  : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
              }`}
            >
              <p className="mb-3 font-medium text-zinc-900 dark:text-white">
                {idx + 1}. {question.question || question.text}
                {question.points > 1 && (
                  <span className="ml-2 text-xs text-zinc-500">({question.points} pts)</span>
                )}
              </p>

              {question.type === "true-false" ? (
                <div className="space-y-2">
                  {["True", "False"].map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                        userAnswer === opt
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700"
                      } ${submitted ? "pointer-events-none" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        value={opt}
                        checked={userAnswer === opt}
                        onChange={() => setAnswers({ ...answers, [idx]: opt })}
                        disabled={submitted}
                        className="accent-blue-500"
                      />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {question.options?.map((option: string, optIdx: number) => {
                    const isThisCorrect = submitted && option === correct;
                    return (
                      <label
                        key={optIdx}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                          userAnswer === option
                            ? submitted
                              ? isThisCorrect
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                : "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : isThisCorrect
                              ? "border-green-400 bg-green-50/50 dark:bg-green-900/10"
                              : "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700"
                        } ${submitted ? "pointer-events-none" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          value={option}
                          checked={userAnswer === option}
                          onChange={() => setAnswers({ ...answers, [idx]: option })}
                          disabled={submitted}
                          className="accent-blue-500"
                        />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{option}</span>
                        {submitted && isThisCorrect && (
                          <span className="ml-auto text-xs font-medium text-green-600">Correct</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Score + Actions */}
        {submitted ? (
          <div className={`rounded-xl p-6 text-center ${
            score >= passingScore
              ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700"
              : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-700"
          }`}>
            <p className="text-3xl font-bold mb-2">{score}%</p>
            <p className={`text-sm ${score >= passingScore ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
              {score >= passingScore ? "You passed! Chapter marked as complete." : `You need ${passingScore}% to pass. Try again!`}
            </p>
            {score < passingScore && (
              <button
                onClick={handleRetry}
                className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Retry Quiz
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Submit Quiz
          </button>
        )}
      </div>
    );
  };

  // Audio player UI
  const AudioContent = ({ audioUrl }: { audioUrl: string }) => (
    <div className="p-6">
      <audio controls className="w-full rounded-md">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );

  // Render content based on type
  const renderContent = () => {
    if (!activeChapter) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 p-4 mb-4 shadow-inner dark:from-zinc-700 dark:to-zinc-800">
            <IconComponent size={32} className="text-gray-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-zinc-300 mb-2">
            No Content Available
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-md">
            Select a chapter from the course content to start learning.
          </p>
        </div>
      );
    }

    switch (contentType) {
      case "text":
        return (
          <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-gray-200/50 dark:border-zinc-600/30">
            <TextContent content={activeChapter.content?.text || activeChapter.content || "No text content available."} />
          </div>
        );

      case "quiz":
        return (
          <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-gray-200/50 dark:border-zinc-600/30">
            <QuizContent
              quizData={activeChapter.content?.quiz || activeChapter.content}
              onPass={() => onChapterComplete?.(activeChapter.id)}
            />
          </div>
        );

      case "audio":
        return (
          <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-gray-200/50 dark:border-zinc-600/30">
            <AudioContent audioUrl={activeChapter.content?.audioUrl || activeChapter.content || ""} />
          </div>
        );

      case "video":
      default:
        return (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg dark:from-zinc-800 dark:to-zinc-900 border border-gray-200/50 dark:border-zinc-600/30">
            <VideoPlayer
              videoUrl={activeChapter.content?.videoUrl || activeChapter.content || ""}
              chapterId={activeChapter.id}
              onComplete={() => {
                onChapterComplete?.(activeChapter.id);
                toast.success("Chapter completed!");
              }}
            />
          </div>
        );
    }
  };

  return (
    <section className="w-full rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md dark:bg-zinc-900/80 dark:border-zinc-700/50 dark:hover:border-zinc-600/50">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-zinc-700/50">
        <div
          className={`rounded-xl bg-gradient-to-br ${contentInfo.gradient} p-2 shadow-lg shadow-${contentInfo.gradient.split("-")[1]}-500/25`}
        >
          <IconComponent size={20} className="text-white" />
        </div>
        <div>
          <h2
            className={`text-xl font-bold bg-gradient-to-r ${contentInfo.gradient} bg-clip-text text-transparent dark:from-${contentInfo.gradient.split("-")[1]}-400 dark:to-${contentInfo.gradient.split("-")[3]}-400`}
          >
            {contentInfo.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            {activeChapter ? `${activeChapter.title} • ${contentInfo.description}` : "Select a chapter to start learning"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <div
          className={`absolute -inset-4 bg-gradient-to-br ${contentInfo.gradient.replace(
            /from-[^-]+/,
            contentInfo.gradient.match(/from-[^-]+/)?.[0] || ""
          ).replace(/to-[^-]+/, contentInfo.gradient.match(/to-[^-]+/)?.[0] || "")} rounded-3xl opacity-60 blur-sm dark:opacity-30 -z-10`}
        />
        {renderContent()}

        {/* Progress Indicator */}
        {activeChapter && (
          <div className="flex items-center justify-between mt-4 px-2">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
              Current Chapter
            </span>
            <span
              className={`text-xs font-semibold bg-gradient-to-r ${contentInfo.gradient} bg-clip-text text-transparent`}
            >
              {activeChapter.position !== undefined
                ? `Chapter ${activeChapter.position + 1}`
                : "Current"}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-zinc-700/50">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>
            Ready to{" "}
            {contentType === "video"
              ? "play"
              : contentType === "quiz"
              ? "start"
              : contentType === "audio"
              ? "listen"
              : "read"}
          </span>
        </div>
        {activeChapter && (
          <div className="text-xs font-medium text-gray-600 dark:text-zinc-300 capitalize">
            {contentType} Content
          </div>
        )}
      </div>
    </section>
  );
};


export default DynamicContentSection;