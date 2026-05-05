"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useState, useTransition } from "react";
import { upsertUserProgress } from "@/actions/user-progress";

type Course = { id: number; title: string };

type Props = {
  courses: Course[];
  currentCourseId?: number;
};

export const TargetLanguageSelectorClient = ({ courses, currentCourseId }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(currentCourseId ?? "");

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = parseInt(e.target.value, 10);
    if (isNaN(courseId)) return;
    setSelected(courseId);
    startTransition(async () => {
      await upsertUserProgress(courseId);
      router.push("/lesson");
    });
  };

  return (
    <div className="group relative w-full transition-all duration-200 hover:shadow-md">
      <label htmlFor="target-language" className="block text-sm font-semibold text-gray-700 mb-2">
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-green-500" />
          I want to learn
        </span>
      </label>
      <div className="relative">
        <select
          id="target-language"
          value={selected}
          onChange={handleChange}
          disabled={isPending}
          className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 text-gray-700 shadow-sm transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="" disabled>Select</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {isPending && <p className="mt-1 text-xs text-gray-500 animate-pulse">Redirecting...</p>}
    </div>
  );
};