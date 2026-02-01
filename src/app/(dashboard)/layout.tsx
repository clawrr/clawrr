import { SidebarInset, SidebarProvider } from '@/presentation/ui/sidebar';
import { AppSidebar } from '@/presentation/ui/organisms/app-sidebar';
import { auth, signOut } from '@/infrastructure/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    const handleSignOut = async () => {
        'use server';
        await signOut({ redirectTo: '/login' });
    };

    return (
        <SidebarProvider>
            <AppSidebar user={session?.user} signOut={handleSignOut} />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
