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
  onCompleteChallenge: (challengeId: number) => void;
};

export const ConversationStack = ({ conversations, activeIndex, onCompleteChallenge }: Props) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto px-4">
      {conversations.map((conv, idx) => {
        const isActive = idx === activeIndex;
        const isCompleted = conv.completed;
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
              isActive={isActive}
              isCompleted={isCompleted}
              onComplete={isActive ? () => onCompleteChallenge(conv.id) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
};