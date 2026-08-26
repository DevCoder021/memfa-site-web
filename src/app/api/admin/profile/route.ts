import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { username, email } = body;

  if (!username || !email) {
    return NextResponse.json({ error: "Nom d'utilisateur et email requis" }, { status: 400 });
  }

  try {
    const admin = await prisma.admin.update({
      where: { id: session.user.id },
      data: { username, email },
    });
    return NextResponse.json({ username: admin.username, email: admin.email });
  } catch {
    return NextResponse.json({ error: "Ce nom d'utilisateur ou cet email est déjà utilisé" }, { status: 409 });
  }
}