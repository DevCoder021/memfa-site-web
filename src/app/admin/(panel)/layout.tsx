import { requirePageAdmin } from "@/lib/admin-auth";
import AdminPanelShell from "./_components/AdminPanelShell";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePageAdmin();

  return <AdminPanelShell>{children}</AdminPanelShell>;
}
