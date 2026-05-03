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

// Map language codes to display names – only used to filter out the native language from target dropdown
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  // Other languages are not needed because native language can only be English or Hindi
};

export default async function Home() {
  const userProgress = await getUserProgress();
  const currentNativeLanguage = userProgress?.nativeLanguage || "en";
  const allCourses = await getCoursesByNativeLanguage(currentNativeLanguage);

  // Remove the native language from target options
  let targetCourses = allCourses.filter(
    (course) => course.title !== LANGUAGE_NAMES[currentNativeLanguage]
  );
  // Additionally remove Odia from the target dropdown (no Odia course in target)
  targetCourses = targetCourses.filter((course) => course.title !== "Odia");

  let defaultTargetId: number | undefined = userProgress?.activeCourseId ?? undefined;
  if (defaultTargetId && !targetCourses.some(c => c.id === defaultTargetId)) {
    defaultTargetId = undefined;
  }
  if (!defaultTargetId && targetCourses.length > 0) {
    const hindiCourse = targetCourses.find(
      (c) => c.title.toLowerCase() === "hindi"
    );
    defaultTargetId = hindiCourse?.id ?? targetCourses[0].id;
  }

  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
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