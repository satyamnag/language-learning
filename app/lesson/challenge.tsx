"use client";

import { cn } from "@/lib/utils";
import { challengeOptions } from "@/db/schema";

type Props = {
  options: typeof challengeOptions.$inferSelect[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: "SELECT" | "ASSIST";
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
}: Props) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2 lg:gap-4">
      {options.map((option) => {
        const isSelected = selectedOption === option.id;
        const isCorrect = option.correct;
        const showCorrect = status === "correct" && isSelected;
        const showWrong = status === "wrong" && isSelected;
        const showOtherCorrect = status !== "none" && isCorrect && !isSelected;

        return (
          <button
            key={option.id}
            disabled={disabled}
            onClick={() => onSelect(option.id)}
            className={cn(
              "w-full rounded-xl border-2 border-b-4 p-3 lg:p-4 text-sm lg:text-base font-medium transition-all duration-200 active:translate-y-[2px] active:border-b-2",
              !isSelected && "bg-white text-neutral-700 border-neutral-200 hover:bg-gray-50",
              showCorrect && "bg-green-50 text-green-700 border-green-300",
              showWrong && "bg-red-50 text-red-700 border-red-300",
              showOtherCorrect && "bg-green-50 text-green-700 border-green-300",
              disabled && "pointer-events-none opacity-80"
            )}
          >
            {option.text}
            {option.imageSrc && (
              <img
                src={option.imageSrc}
                alt={option.text}
                className="mt-2 mx-auto h-12 object-cover rounded-md"
              />
            )}
            {option.audioSrc && (
              <div className="mt-2 text-xs text-blue-600 underline">🔊 listen</div>
            )}
          </button>
        );
      })}
    </div>
  );
};