"use server";

import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";

export const initializeUserProgress = async (userId: string, courseId: number) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const existing = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (existing) {
    // Only update the active course, keep other fields
    await db
      .update(userProgress)
      .set({ activeCourseId: courseId })
      .where(eq(userProgress.userId, userId));
  } else {
    // Insert a new record with default values
    await db.insert(userProgress).values({
      userId,
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/logo.png",
      hearts: 5,
      points: 0,
      nativeLanguage: "en", // default, user can change later via dropdown
    });
  }

  revalidatePath("/");
};