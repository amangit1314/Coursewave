"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Plus, Minus, X } from "lucide-react";

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface ChapterQuizSectionProps {
  quizQuestions: QuizQuestion[];
  isGeneratingQuiz: boolean;
  onAddQuestion: () => void;
  onRemoveQuestion: (id: string) => void;
  onUpdateQuestion: (id: string, field: string, value: any) => void;
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, optionIndex: number) => void;
  onAIGenerateQuiz: () => void;
}

export const ChapterQuizSection = ({
  quizQuestions,
  isGeneratingQuiz,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onAIGenerateQuiz,
}: ChapterQuizSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Quiz Questions Management */}
      <div className="space-y-4">
        {quizQuestions.map((question, index) => (
          <div
            key={question.id}
            className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-600"
          >
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">
                Question {index + 1}
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveQuestion(question.id)}
                className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Minus className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-3">
              <Input
                value={question.question}
                onChange={(e) =>
                  onUpdateQuestion(question.id, "question", e.target.value)
                }
                placeholder="Enter your question"
                className="bg-white dark:bg-zinc-800"
              />

              <Select
                value={question.type}
                onValueChange={(
                  value: "multiple-choice" | "true-false" | "short-answer"
                ) => onUpdateQuestion(question.id, "type", value)}
              >
                <SelectTrigger className="bg-white dark:bg-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="true-false">
                    True/False
                  </SelectItem>
                  <SelectItem value="short-answer">
                    Short Answer
                  </SelectItem>
                </SelectContent>
              </Select>

              {question.type === "multiple-choice" && (
                <div className="space-y-2">
                  <Label className="text-sm">Options</Label>
                  {question.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) =>
                          onUpdateOption(question.id, optIndex, e.target.value)
                        }
                        placeholder={`Option ${optIndex + 1}`}
                        className="bg-white dark:bg-zinc-800 flex-1"
                      />
                      {question.options &&
                        question.options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              onRemoveOption(question.id, optIndex)
                            }
                            className="h-10 w-10 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onAddOption(question.id)}
                    className="w-full border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                  <Input
                    value={question.correctAnswer}
                    onChange={(e) =>
                      onUpdateQuestion(
                        question.id,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                    placeholder="Correct answer (enter the exact option text)"
                    className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  />
                </div>
              )}

              {question.type === "true-false" && (
                <Select
                  value={question.correctAnswer}
                  onValueChange={(value) =>
                    onUpdateQuestion(question.id, "correctAnswer", value)
                  }
                >
                  <SelectTrigger className="bg-white dark:bg-zinc-800">
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {question.type === "short-answer" && (
                <Input
                  value={question.correctAnswer}
                  onChange={(e) =>
                    onUpdateQuestion(
                      question.id,
                      "correctAnswer",
                      e.target.value
                    )
                  }
                  placeholder="Expected answer"
                  className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                />
              )}

              <div className="flex items-center gap-2">
                <Label className="text-sm">Points:</Label>
                <Input
                  type="number"
                  value={question.points}
                  onChange={(e) =>
                    onUpdateQuestion(
                      question.id,
                      "points",
                      parseInt(e.target.value) || 1
                    )
                  }
                  min="1"
                  max="10"
                  className="w-20 bg-white dark:bg-zinc-800"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={onAddQuestion}
          variant="outline"
          className="flex-1 border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
        <Button
          type="button"
          onClick={onAIGenerateQuiz}
          disabled={isGeneratingQuiz}
          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white"
        >
          {isGeneratingQuiz ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          AI Generate
        </Button>
      </div>

      {quizQuestions.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Total Questions: {quizQuestions.length} | Total Points:{" "}
            {quizQuestions.reduce((sum, q) => sum + q.points, 0)}
          </p>
        </div>
      )}
    </div>
  );
};
