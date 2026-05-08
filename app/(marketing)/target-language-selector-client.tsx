"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const currentCourse = courses.find((c) => c.id === Number(selected));

  const handleSelect = (courseId: number) => {
    if (isPending) return;
    setSelected(courseId);
    startTransition(async () => {
      await upsertUserProgress(courseId);
      router.push("/lesson");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between border border-gray-300 bg-white shadow-sm"
          disabled={isPending}
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <BookOpen className="h-4 w-4 text-green-500" />
            I want to learn
          </span>
          {currentCourse && (
            <span className="ml-2 text-[#7C3AED]">{currentCourse.title}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {courses.map((course) => (
          <DropdownMenuItem
            key={course.id}
            onClick={() => handleSelect(course.id)}
            className="flex justify-between"
          >
            {course.title}
            {course.id === Number(selected) && (
              <span className="text-green-500">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};