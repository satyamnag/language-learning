"use server";

import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import db from "@/db/drizzle";
import { challengeProgress } from "@/db/schema";

export const resetChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .delete(challengeProgress)
    .where(
      and(
        eq(challengeProgress.userId, userId),
        eq(challengeProgress.challengeId, challengeId)
      )
    );
};