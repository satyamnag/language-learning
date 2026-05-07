"use client";

import { challenges, challengeOptions } from "@/db/schema";
import { QuestionBubble } from "./question-bubble";

type Conversation = typeof challenges.$inferSelect & {
  completed: boolean;
  challengeOptions: typeof challengeOptions.$inferSelect[];
};

type Props = {
  conversations: Conversation[];
  activeIndex: number;
  onCompleteChallenge: (challengeId: number) => void;   // kept for future use, but not passed to children
};

export const ConversationStack = ({ conversations, activeIndex }: Props) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto px-4">
      {conversations.map((conv, idx) => {
        const isActive = idx === activeIndex;
        const isCompleted = conv.completed;
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
              <span className="absolute top-2 left-2 z-20 bg-[#7C3AED] text-white text-xs font-bold px-2 py-0.5 rounded">
                ACTIVE
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
          </div>
        );
      })}
    </div>
  );
};