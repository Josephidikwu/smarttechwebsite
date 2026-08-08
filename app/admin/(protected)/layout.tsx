import { requireUser } from "@/lib/auth/rbac";
import { AdminSidebar } from "@/components/sections/admin/admin-sidebar";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-subtle)]">
      <AdminSidebar user={user} />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
