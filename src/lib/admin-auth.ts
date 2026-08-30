import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

export interface VerifiedAdminSession {
  session: Session;
  adminId: string;
}

export async function getVerifiedAdminSession(): Promise<VerifiedAdminSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  if (session.user.role !== "ADMIN") return null;

  const admin = await prisma.admin.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!admin) return null;

  return { session, adminId: admin.id };
}

export async function requireApiAdmin(): Promise<
  | { ok: true; session: Session; adminId: string }
  | { ok: false; response: NextResponse }
> {
  const verified = await getVerifiedAdminSession();
  if (!verified) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Non autorisé" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      ),
    };
  }
  return { ok: true, session: verified.session, adminId: verified.adminId };
}

export async function requirePageAdmin(): Promise<VerifiedAdminSession> {
  const verified = await getVerifiedAdminSession();
  if (!verified) {
    redirect("/admin");
  }
  return verified;
}
