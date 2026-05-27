import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/app/dashboard/_components/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) redirect("/auth/login");

  return <DashboardShell userEmail={session.user.email}>{children}</DashboardShell>;
}
