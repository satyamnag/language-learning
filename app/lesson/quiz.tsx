"use client";

import { toast } from "sonner";
import Image from "next/image";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { useState, useTransition, useRef, useEffect } from "react";
import { useAudio, useWindowSize, useMount } from "react-use";

import { reduceHearts } from "@/actions/user-progress";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { usePracticeModal } from "@/store/use-practice-modal";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { useWordTranslator } from "@/hooks/useWordTranslator";

import { Header } from "./header";
import { Footer } from "./footer";
import { Challenge } from "./challenge";
import { ResultCard } from "./result-card";
import { QuestionBubble } from "./question-bubble";
import { ConversationStack } from "./conversation-stack";
import { ActionButtons } from "./action-buttons";

type Props ={
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: typeof challengeOptions.$inferSelect[];
  })[];
  userSubscription: typeof userSubscription.$inferSelect & {
    isActive: boolean;
  } | null;
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const { width, height } = useWindowSize();
  const router = useRouter();

  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: "/incorrect.wav" });
  const [pending, startTransition] = useTransition();

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [challenges, setChallenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = challenges.findIndex((c) => !c.completed);
    return idx === -1 ? 0 : idx;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const currentChallenge = challenges[activeIndex];
  const options = currentChallenge?.challengeOptions ?? [];

  // --- Word translator (Tippy.js + cache) for SELECT questions ---
  const { wrapWords, attachTooltips } = useWordTranslator('ta', 'en');
  const selectQuestionRef = useRef<HTMLDivElement>(null);
  const assistQuestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentChallenge && currentChallenge.type === "SELECT" && currentChallenge.question && selectQuestionRef.current) {
      const html = wrapWords(currentChallenge.question);
      selectQuestionRef.current.innerHTML = html;
      attachTooltips(selectQuestionRef.current);
    }
  }, [currentChallenge, wrapWords, attachTooltips]);

  // --- Core completion logic ---
  const completeChallenge = (challengeId: number, isCorrect: boolean) => {
    if (pending) return;
    startTransition(() => {
      if (isCorrect) {
        upsertChallengeProgress(challengeId)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }
            correctControls.play();
            setChallenges((prev) =>
              prev.map((c) => (c.id === challengeId ? { ...c, completed: true } : c))
            );
            setPercentage((prev) => prev + 100 / challenges.length);
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
            const nextIdx = challenges.findIndex((c, idx) => idx > activeIndex && !c.completed);
            if (nextIdx !== -1) {
              setActiveIndex(nextIdx);
              setStatus("none");
              setSelectedOption(undefined);
            } else {
              setActiveIndex(challenges.length);
            }
          })
          .catch(() => toast.error("Something went wrong"));
      } else {
        reduceHearts(challengeId)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }
            incorrectControls.play();
            setStatus("wrong");
            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong"));
      }
    });
  };

  // For multiple‑choice challenges
  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;
    const correctOption = options.find((opt) => opt.correct);
    if (!correctOption) return;
    const isCorrect = correctOption.id === selectedOption;
    if (isCorrect) {
      setStatus("correct");
      completeChallenge(currentChallenge.id, true);
    } else {
      setStatus("wrong");
      completeChallenge(currentChallenge.id, false);
    }
  };

  // Build conversation stack (2 items initially, 3 after first completion)
  let startIdx = activeIndex;
  let windowCount = 2;
  if (activeIndex > 0 && challenges[activeIndex - 1].completed) {
    startIdx = activeIndex - 1;
    windowCount = 3;
  }
  const visibleChallenges = challenges.slice(startIdx, startIdx + windowCount);
  let visibleActiveIndex = visibleChallenges.findIndex(c => c.id === currentChallenge?.id);
  if (visibleActiveIndex === -1 && visibleChallenges.length) visibleActiveIndex = 0;

  // Finish screen
  if (activeIndex >= challenges.length) {
    return (
      <>
        {finishAudio}
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} tweenDuration={10000} />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image src="/finish.svg" alt="Finish" className="hidden lg:block" height={100} width={100} />
          <Image src="/finish.svg" alt="Finish" className="block lg:hidden" height={50} width={50} />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">Great job! <br /> You&apos;ve completed the lesson.</h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer lessonId={lessonId} status="completed" onCheck={() => router.push("/learn")} />
      </>
    );
  }

  const usesDirectAnswer = !!currentChallenge.directAnswer;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header hearts={hearts} percentage={percentage} hasActiveSubscription={!!userSubscription?.isActive} />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            {/* Conversation stack (2 or 3 items) */}
            <ConversationStack
              conversations={visibleChallenges}
              activeIndex={visibleActiveIndex}
            />

            {/* Action buttons for the active challenge (only one set, at the bottom) */}
            {currentChallenge && (
              <ActionButtons
                key={currentChallenge.id}               // ← forces reset for each new challenge
                audioSrc={currentChallenge.audioSrc ?? undefined}
                onComplete={() => completeChallenge(currentChallenge.id, true)}
                disabled={pending || currentChallenge.completed}
              />
            )}

            {/* For multiple‑choice challenges, show answer options and footer */}
            {!usesDirectAnswer && (
              <>
                <div className="mt-4">
                  <Challenge
                    options={options}
                    onSelect={onSelect}
                    status={status}
                    selectedOption={selectedOption}
                    disabled={pending}
                    type={currentChallenge.type}
                  />
                </div>
                <Footer
                  disabled={pending || !selectedOption}
                  status={status}
                  onCheck={onContinue}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};