import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { challenges } from "@/db/schema";

export const GET = async () => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.challenges.findMany();

  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  // Default to 'ASSIST' if type is missing (the dropdown has been removed)
  const data = await db.insert(challenges).values({
    ...body,
    type: body.type || "ASSIST",
  }).returning();

  return NextResponse.json(data[0]);
};