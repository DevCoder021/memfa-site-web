import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { MessageCreateSchema } from "@/lib/validation-schemas";

export async function POST(req: Request) {
  const parsed = await parseBody(req, MessageCreateSchema);
  if (!parsed.ok) return parsed.response;
  const { nom, email, telephone, message } = parsed.data;

  const created = await prisma.message.create({
    data: { nom, email, telephone: telephone || null, message },
  });

  return NextResponse.json(created, {
    status: 201,
    headers: { "Cache-Control": "no-store" },
  });
}
