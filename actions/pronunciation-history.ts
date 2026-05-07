"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { pronunciationHistory } from "@/db/schema";

export const storePronunciationAssessment = async (params: {
  challengeId: number;
  score: number;
  spokenText: string;
  targetSentence: string;
  explanation: string;
}) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(pronunciationHistory).values({
    userId,
    challengeId: params.challengeId,
    score: params.score,
    spokenText: params.spokenText,
    targetSentence: params.targetSentence,
    explanation: params.explanation,
  });
};