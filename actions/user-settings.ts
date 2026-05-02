"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import db from "@/db/drizzle";
import { userProgress, courses } from "@/db/schema";

export const updateNativeLanguage = async (languageCode: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Fetch current user progress
  const currentProgress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  let activeCourseId = currentProgress?.activeCourseId;

  // If there is an active course, check if its sourceLanguage matches the new native language
  if (activeCourseId) {
    const activeCourse = await db.query.courses.findFirst({
      where: eq(courses.id, activeCourseId),
    });
    if (activeCourse && activeCourse.sourceLanguage !== languageCode) {
      // Mismatch: clear the active course
      activeCourseId = null;
    }
  }

  // Update native language and optionally clear activeCourseId
  await db
    .update(userProgress)
    .set({ nativeLanguage: languageCode, activeCourseId })
    .where(eq(userProgress.userId, userId));

  // Revalidate all pages that depend on user progress or course lists
  revalidatePath("/");
  revalidatePath("/learn");
  revalidatePath("/courses");
  revalidatePath("/leaderboard");
  revalidatePath("/shop");
  revalidatePath("/quests");
};