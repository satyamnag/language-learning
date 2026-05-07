"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";

export const setDefaultCourse = async (courseId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .update(userProgress)
    .set({ activeCourseId: courseId })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/");
  redirect("/");
};