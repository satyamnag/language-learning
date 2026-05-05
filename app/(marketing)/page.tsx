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
import { redirect } from "next/navigation";
import { getUserProgress, getCoursesByNativeLanguage, getCourseProgress, getLessonPercentage, getUnits, getUserSubscription } from "@/db/queries";
import { NativeLanguageSelector } from "@/components/native-language-selector";
import { TargetLanguageSelectorClient } from "./target-language-selector-client";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { lessons, units as unitsSchema } from "@/db/schema";
import { Unit } from "@/app/(main)/learn/unit";
import { Header } from "@/app/(main)/learn/header";

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

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
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
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <NativeLanguageSelector currentNativeLanguage={currentNativeLanguage} />
                  </div>
                  {courses.length > 0 && (
                    <div className="flex-1">
                      <TargetLanguageSelectorClient 
                        courses={courses}
                        currentCourseId={activeCourseId ?? undefined}
                      />
                    </div>
                  )}
                </div>
                {activeCourseId && <LearnContent />}
              </div>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}