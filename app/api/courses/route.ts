import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { courses } from "@/db/schema";

export const GET = async () => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Explicitly select id, title, and sourceLanguage for the admin dropdown
  const data = await db.query.courses.findMany({
    columns: {
      id: true,
      title: true,
      sourceLanguage: true,
    },
  });

  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db.insert(courses).values({
    ...body,
  }).returning();

  return NextResponse.json(data[0]);
};