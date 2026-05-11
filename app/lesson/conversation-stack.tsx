"use client";

import { challenges, challengeOptions } from "@/db/schema";
import { QuestionBubble } from "./question-bubble";
import { RotateCw } from "lucide-react";

type Conversation = typeof challenges.$inferSelect & {
  completed: boolean;
  challengeOptions: typeof challengeOptions.$inferSelect[];
};

type Props = {
  conversations: Conversation[];
  activeIndex: number;
  onCompleteChallenge: (challengeId: number) => void;
  challengeScores: Record<number, { score: number; explanation: string }>;
  onRetryChallenge: (challengeId: number) => void;
};

export const ConversationStack = ({
  conversations,
  activeIndex,
  onCompleteChallenge,
  challengeScores,
  onRetryChallenge,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto px-4">
      {conversations.map((conv, idx) => {
        const isActive = idx === activeIndex;
        const isCompleted = conv.completed;
        const scoreData = challengeScores[conv.id];

        return (
          <div
            key={conv.id}
            className={`relative w-full transition-all duration-300 rounded-2xl ${
              isActive
                ? "scale-105 shadow-2xl ring-2 ring-[#7C3AED] ring-offset-2 z-10"
                : isCompleted
                ? "opacity-70 scale-95"
                : "opacity-50 scale-95"
            }`}
          >
            {isActive && (
              <span className="absolute top-2 left-2 z-20">
                <span className="block w-2.5 h-2.5 bg-green-500 rounded-full shadow-md ring-2 ring-white" />
              </span>
            )}
            <QuestionBubble
              question={conv.question}
              translation={conv.nativeText ?? undefined}
              speaker={conv.speaker ?? undefined}
              romanized={conv.directAnswer ?? undefined}
              isActive={isActive}
              isCompleted={isCompleted}
            />
            {/* Score badge & retry button for completed challenges */}
            {isCompleted && scoreData && (
              <div className="flex items-center justify-end gap-2 mt-1 pr-2">
                <span className="text-xs font-medium text-[#7C3AED]">
                  {scoreData.score}%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetryChallenge(conv.id);
                  }}
                  className="text-gray-400 hover:text-[#7C3AED] transition"
                  title="Retry this challenge"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};