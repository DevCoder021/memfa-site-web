import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { PasswordChangeSchema } from "@/lib/validation-schemas";

export async function PUT(req: Request) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const parsed = await parseBody(req, PasswordChangeSchema);
  if (!parsed.ok) return parsed.response;
  const { currentPassword, newPassword } = parsed.data;

  const admin = await prisma.admin.findUnique({ where: { id: auth.adminId } });
  if (!admin) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, admin.password);
  if (!valid) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } });

  return NextResponse.json({ success: true });
}

