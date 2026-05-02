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
import { TargetLanguageSelector } from "@/components/target-language-selector";

// Map language codes to their display names (used for filtering)
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada",
  or: "Odia",
  bn: "Bengali",
};

export default async function Home() {
  const userProgress = await getUserProgress();
  const currentNativeLanguage = userProgress?.nativeLanguage || "en";
  const allCourses = await getCoursesByNativeLanguage(currentNativeLanguage);
  
  // Filter out the native language from the target courses list
  const targetCourses = allCourses.filter(
    (course) => course.title !== LANGUAGE_NAMES[currentNativeLanguage]
  );

  // Determine the default selected course ID (never null)
  let defaultTargetId: number | undefined = userProgress?.activeCourseId ?? undefined;
  
  // If the active course is no longer in the filtered list, reset it
  if (defaultTargetId && !targetCourses.some(c => c.id === defaultTargetId)) {
    defaultTargetId = undefined;
  }
  
  // Fallback to Hindi or first available course if no target ID is set
  if (!defaultTargetId && targetCourses.length > 0) {
    const hindiCourse = targetCourses.find(
      (c) => c.title.toLowerCase() === "hindi"
    );
    defaultTargetId = hindiCourse?.id ?? targetCourses[0].id;
  }

  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-justify">
          Learn, practice, and master Indian regional languages with{" "}
          <span className="text-blue-600 font-bold">SUNO</span>{" "}
          <span className="text-green-600 font-bold">BOLO</span>.
        </h1>
        <div className="flex flex-col items-center gap-y-3 max-w-[380px] w-full">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
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
            </SignedOut>
            <SignedIn>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                  <NativeLanguageSelector currentNativeLanguage={currentNativeLanguage} />
                </div>
                {targetCourses.length > 0 && (
                  <div className="flex-1">
                    <TargetLanguageSelector
                      courses={targetCourses}
                      currentCourseId={defaultTargetId}
                    />
                  </div>
                )}
              </div>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}