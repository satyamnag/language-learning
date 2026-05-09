"use client";

import Link from "next/link";
import { Check, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { resetLessonProgress } from "@/actions/lesson-progress";
import { useTransition } from "react";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
  title: string;
};

export const LessonButton = ({
  id,
  locked,
  current,
  percentage,
  title,
}: Props) => {
  const href = `/lesson/${id}`;
  const isCompleted = !locked && !current && percentage === 100;
  const [isResetting, startReset] = useTransition();

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isResetting) return;
    startReset(() => {
      resetLessonProgress(id);
    });
  };

  return (
    <Link
      href={href}
      aria-disabled={locked}
      style={{ pointerEvents: locked ? "none" : "auto" }}
      className={cn(
        "block w-full mb-3 transition-all duration-200",
        locked && "opacity-50 cursor-not-allowed",
        current && "ring-2 ring-[#7C3AED] shadow-md shadow-purple-200/50 rounded-xl"
      )}
    >
      <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-base">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {isCompleted && <Check className="w-5 h-5 text-green-600" />}
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Reset lesson progress"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Purple progress bar */}
        <div className="w-full bg-[#ede5f4] rounded-full h-2.5">
          <div
            className="bg-[#7C3AED] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
        {current && (
          <p className="text-xs text-gray-500 mt-2 text-right">
            {Math.round(percentage)}% complete
          </p>
        )}
      </div>
    </Link>
  );
};