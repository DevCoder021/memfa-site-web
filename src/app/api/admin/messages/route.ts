import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(messages, {
    headers: { "Cache-Control": "no-store" },
  });
}
