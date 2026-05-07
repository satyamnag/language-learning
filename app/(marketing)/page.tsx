import Image from "next/image";
import { Loader } from "lucide-react";
import { 
  ClerkLoaded, 
  ClerkLoading, 
  SignedIn, 
  SignedOut
} from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserProgress, getCoursesByNativeLanguage, getCourseProgress, getLessonPercentage, getUnits, getUserSubscription } from "@/db/queries";
import { NativeLanguageSelector } from "@/components/native-language-selector";
import { TargetLanguageSelectorClient } from "./target-language-selector-client";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { lessons, units as unitsSchema } from "@/db/schema";
import { Unit } from "@/app/(main)/learn/unit";
import { Header } from "@/app/(main)/learn/header";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { initializeUserProgress } from "@/actions/initialize-user-progress";

async function LearnContent() {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();
  const userSubscriptionData = getUserSubscription();

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (!courseProgress) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <div />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson as typeof lessons.$inferSelect & {
                unit: typeof unitsSchema.$inferSelect;
              } | undefined}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
}

export default async function Home() {
  const userProgress = await getUserProgress();
  const currentNativeLanguage = userProgress?.nativeLanguage || "en";
  const courses = await getCoursesByNativeLanguage(currentNativeLanguage);
  let activeCourseId = userProgress?.activeCourseId;

  // If signed in and no active course (or no userProgress record at all),
  // initialise the user with the default English → Hindi course.
  const isSignedIn = userProgress !== undefined; // actually getUserProgress returns null if no record, but user exists in Clerk
  // We need to know if the user is signed in. We can use the `auth` directly? For simplicity:
  // We'll rely on the presence of userProgress? But new user has null. We'll add a separate check using `auth`.
  // Simpler: if activeCourseId is null and courses exist, we initialise.
  // However for a new user, activeCourseId is null, but userProgress is null, so the condition below will work.
  if (!activeCourseId && courses.length > 0) {
    const englishToHindiCourse = courses.find(
      (course) => course.sourceLanguage === "en" && course.title.toLowerCase() === "hindi"
    );
    const defaultCourseId = englishToHindiCourse?.id ?? courses[0].id;
    await initializeUserProgress(defaultCourseId);
    redirect("/");
  }

  return (
    <>
      <SignedOut>
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
                    <span className="text-green-600 font-extrabold">bolbolke</span>.
                  </h1>
                </SignedOut>
              </ClerkLoaded>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <MobileHeader />
        <div className="flex h-full">
          <Sidebar className="hidden lg:flex" />
          <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0 w-full">
            <div className="max-w-[1056px] mx-auto pt-6 h-full">
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="flex-1 max-w-md mx-auto sm:mx-0">
                    <NativeLanguageSelector currentNativeLanguage={currentNativeLanguage} />
                  </div>
                  <div className="flex-1 max-w-md mx-auto sm:mx-0">
                    {courses.length > 0 && (
                      <TargetLanguageSelectorClient 
                        courses={courses}
                        currentCourseId={activeCourseId ?? undefined}
                      />
                    )}
                  </div>
                </div>
              </div>
              {activeCourseId && <LearnContent />}
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  );
}