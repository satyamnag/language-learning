"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";

export const updateNativeLanguage = async (languageCode: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Update the user's native language in the database
  await db
    .update(userProgress)
    .set({ nativeLanguage: languageCode })
    .where(eq(userProgress.userId, userId));

  // Revalidate the homepage to show the updated selection
  revalidatePath("/");
};