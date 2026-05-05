import Image from "next/image";
import { Loader } from "lucide-react";
import { 
  ClerkLoaded, 
  ClerkLoading, 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserProgress, getCoursesByNativeLanguage } from "@/db/queries";
import { NativeLanguageSelector } from "@/components/native-language-selector";
import { upsertUserProgress } from "@/actions/user-progress";
import { redirect } from "next/navigation";
import { TargetLanguageSelector } from "./target-language-selector-wrapper"; // we'll create a client wrapper

// Instead of using the original TargetLanguageSelector which redirects to /learn,
// we create a client wrapper that redirects to /lesson after selecting a language.
// This file is a server component, so we need a client component for the dropdown.

export default async function Home() {
  const userProgress = await getUserProgress();
  const currentNativeLanguage = userProgress?.nativeLanguage || "en";
  const courses = await getCoursesByNativeLanguage(currentNativeLanguage);
  const activeCourseId = userProgress?.activeCourseId;

  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      <div className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
        <Image src="/hero.png" fill alt="Hero" />
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <div className="flex flex-col items-center gap-y-3 max-w-[380px] w-full">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-justify">
                Learn, practice, and master Indian regional languages with{" "}
                <span className="text-blue-600 font-extrabold">SUNO</span>{" "}
                <span className="text-green-600 font-extrabold">BOLO</span>.
              </h1>
              <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full mt-4">
                <SignUpButton mode="modal" fallbackRedirectUrl="/learn">
                  <Button size="lg" variant="primary" className="w-full">
                    Get Started
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal" fallbackRedirectUrl="/learn">
                  <Button size="lg" variant="primaryOutline" className="w-full">
                    I already have an account
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                  <NativeLanguageSelector currentNativeLanguage={currentNativeLanguage} />
                </div>
                <div className="flex-1">
                  {/* Custom target language dropdown that redirects to /lesson */}
                  <ClientTargetLanguageSelector 
                    courses={courses}
                    currentCourseId={activeCourseId}
                  />
                </div>
              </div>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}

// Client component wrapper for the target language dropdown
"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useState, useTransition } from "react";
import { upsertUserProgress } from "@/actions/user-progress";

type Course = { id: number; title: string };

function ClientTargetLanguageSelector({ courses, currentCourseId }: { courses: Course[]; currentCourseId?: number }) {
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
    <div className="mt-4 p-4 border rounded-xl shadow-sm bg-white">
      <label htmlFor="target-language" className="block text-sm font-medium text-gray-700 mb-2">
        I want to learn
      </label>
      <div className="relative">
        <select
          id="target-language"
          value={selected}
          onChange={handleChange}
          disabled={isPending}
          className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
        >
          <option value="" disabled>Select a language</option>
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
      {isPending && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
    </div>
  );
}