"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertUserProgress } from "@/actions/user-progress";
import { BookOpen } from "lucide-react";

type Props = {
  courses: { id: number; title: string }[];
  currentCourseId?: number;
};

export const TargetLanguageSelector = ({ courses, currentCourseId }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Find Hindi course (case‑insensitive) for default selection
  const hindiCourse = courses.find(
    (course) => course.title.toLowerCase() === "hindi"
  );
  const defaultCourseId = hindiCourse?.id ?? courses[0]?.id;

  // Use current active course if exists; otherwise default to Hindi
  const selectedValue = currentCourseId ?? defaultCourseId;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = parseInt(e.target.value, 10);
    if (courseId === currentCourseId) {
      router.push("/learn");
      return;
    }
    startTransition(async () => {
      await upsertUserProgress(courseId);
    });
  };

  return (
    <div className="mt-4 p-4 border rounded-xl shadow-sm bg-white">
      <label htmlFor="target-language" className="block text-sm font-medium text-gray-700 mb-2">
        I want to learn
      </label>
      <div className="relative">
        <select
          id="target-language"
          value={selectedValue ?? ""}
          onChange={handleChange}
          disabled={isPending}
          className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <BookOpen className="h-5 w-5 text-gray-400" />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {isPending && <p className="text-sm text-gray-500 mt-2">Redirecting...</p>}
    </div>
  );
};