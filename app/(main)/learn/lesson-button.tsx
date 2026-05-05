"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
  title: string;        // lesson title passed from parent
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

  return (
    <Link
      href={href}
      aria-disabled={locked}
      style={{ pointerEvents: locked ? "none" : "auto" }}
      className={cn(
        "block w-full mb-3 transition-all duration-200",
        locked && "opacity-50 cursor-not-allowed",
        current && "ring-2 ring-green-500 shadow-md"
      )}
    >
      <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-base">
            {title}
          </h3>
          {isCompleted && <Check className="w-5 h-5 text-green-600" />}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
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