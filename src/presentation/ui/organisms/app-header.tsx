'use client';

import { Separator } from '@/presentation/ui/separator';
import { SidebarTrigger } from '@/presentation/ui/sidebar';

interface AppHeaderProps {
    title?: string;
    children?: React.ReactNode;
}

export function AppHeader({ title, children }: AppHeaderProps) {
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            {title && <h1 className="text-sm font-medium">{title}</h1>}
            {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
        </header>
    );
}
