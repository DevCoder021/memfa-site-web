import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const actualites = await prisma.actualite.findMany({
    where: { isPublished: true },
    orderBy: { datePublication: "desc" },
  });
  return NextResponse.json(actualites);
}