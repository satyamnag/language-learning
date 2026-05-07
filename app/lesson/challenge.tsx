"use client";

import { cn } from "@/lib/utils";
import { challengeOptions } from "@/db/schema";
import Image from "next/image";

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
              "w-full rounded-xl p-3 lg:p-4 text-sm lg:text-base font-medium transition-all duration-200",
              !isSelected && "bg-white text-neutral-700 hover:bg-gray-50",
              showCorrect && "bg-green-50 text-green-700",
              showWrong && "bg-red-50 text-red-700",
              showOtherCorrect && "bg-green-50 text-green-700",
              disabled && "pointer-events-none opacity-80"
            )}
          >
            {option.text}
            {option.imageSrc && (
              <Image
                src={option.imageSrc}
                alt={option.text}
                width={48}
                height={48}
                className="mt-2 mx-auto h-12 w-auto object-cover rounded-md"
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