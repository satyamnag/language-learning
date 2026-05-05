"use server";

import { auth } from "@clerk/nextjs/server";
import { eq, inArray, and } from "drizzle-orm";
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

  // Delete challenge_progress records where challengeId is in challengeIds AND userId matches
  await db.delete(challengeProgress).where(
    and(
      inArray(challengeProgress.challengeId, challengeIds),
      eq(challengeProgress.userId, userId)
    )
  );

  revalidatePath(`/lesson/${lessonId}`);
  redirect(`/lesson/${lessonId}`);
};