"use client";

import { useRef, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { challenges, challengeOptions } from "@/db/schema";
import { QuestionBubble } from "./question-bubble";

type Conversation = typeof challenges.$inferSelect & {
  completed: boolean;
  challengeOptions: typeof challengeOptions.$inferSelect[];
};

type Props = {
  conversations: Conversation[];
  activeIndex: number;
  onComplete: (index: number) => void;
};

export const ConversationStack = ({ conversations, activeIndex, onComplete }: Props) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto px-4">
      {conversations.map((conv, idx) => {
        const isCompleted = conv.completed;
        const isActive = idx === activeIndex;
        const isWaiting = !isCompleted && !isActive;

        return (
          <div
            key={conv.id}
            className={`w-full transition-all duration-300 ${
              isActive
                ? "scale-105 shadow-2xl z-10"
                : isCompleted
                ? "opacity-70 scale-95"
                : "opacity-50 scale-95"
            }`}
          >
            <QuestionBubble
              question={conv.question}
              translation={conv.nativeText ?? undefined}
              speaker={conv.speaker ?? undefined}
              romanized={conv.directAnswer ?? undefined}
              audioSrc={conv.audioSrc ?? undefined}
              onComplete={isActive ? () => onComplete(idx) : undefined}
            />
            {isCompleted && (
              <div className="flex justify-center mt-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};