import { VideoPlayer } from "@/components/common/VideoPlayer";
import { Chapter } from "@/types/course-details-api-response";

import { FileText, HelpCircle, Video } from "lucide-react";

const DynamicContentSection = ({
  activeChapter,
}: {
  activeChapter: Chapter;
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

  // Text content UI
  const TextContent = ({ content }: { content: string }) => (
    <div className="prose dark:prose-invert max-w-none p-6">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );

  // Quiz content UI
  const QuizContent = ({ quizData }: any) => (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Quiz</h3>
      {quizData?.questions?.map((question: any, idx: number) => (
        <div key={idx} className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
          <p className="font-medium mb-2">{question.text}</p>
          <div className="space-y-2">
            {question.options?.map((option: any, optIdx: number) => (
              <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={`question-${idx}`} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

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
            <QuizContent quizData={activeChapter.content?.quiz || activeChapter.content} />
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