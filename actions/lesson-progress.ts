"use server";

import { auth } from "@clerk/nextjs/server";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "@/db/drizzle";
import { challenges, challengeProgress } from "@/db/schema";

export const resetLessonProgress = async (lessonId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get all challenge IDs for this lesson
  const lessonChallenges = await db.query.challenges.findMany({
    where: eq(challenges.lessonId, lessonId),
    columns: { id: true },
  });
  const challengeIds = lessonChallenges.map(c => c.id);
  if (challengeIds.length === 0) return;

  // Delete challenge_progress for those challenges and this user
  await db.delete(challengeProgress).where(
    inArray(challengeProgress.challengeId, challengeIds)
  ).where(eq(challengeProgress.userId, userId));

  revalidatePath(`/lesson/${lessonId}`);
  redirect(`/lesson/${lessonId}`);
};