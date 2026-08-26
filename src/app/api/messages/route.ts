import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST — reçoit les soumissions du formulaire de contact public
export async function POST(req: Request) {
  const body = await req.json();
  const { nom, email, telephone, message } = body;

  if (!nom || !email || !message) {
    return NextResponse.json({ error: "Nom, email et message requis" }, { status: 400 });
  }

  const created = await prisma.message.create({
    data: { nom, email, telephone: telephone || null, message },
  });

  return NextResponse.json(created, {
    status: 201,
    headers: { "Cache-Control": "no-store" },
  });
}