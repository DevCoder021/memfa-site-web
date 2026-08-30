import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { ProfileUpdateSchema } from "@/lib/validation-schemas";

export async function PUT(req: Request) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const parsed = await parseBody(req, ProfileUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const { username, email } = parsed.data;

  try {
    const admin = await prisma.admin.update({
      where: { id: auth.adminId },
      data: { username, email },
    });
    return NextResponse.json({ username: admin.username, email: admin.email });
  } catch {
    return NextResponse.json({ error: "Ce nom d'utilisateur ou cet email est deja utilise" }, { status: 409 });
  }
}

