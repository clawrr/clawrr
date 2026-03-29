import { auth, signOut } from "@/infrastructure/auth";
import { AppSidebar } from "@/presentation/ui/organisms/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/presentation/ui/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/login" });
  };

  return (
    <SidebarProvider>
      <AppSidebar signOut={handleSignOut} user={session?.user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
