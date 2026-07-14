'use client';

import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/presentation/ui/dropdown-menu';
import { SidebarMenuButton } from '@/presentation/ui/sidebar';

interface UserMenuProps {
    user: {
        name?: null | string;
        email?: null | string;
        image?: null | string;
    };
    signOut: () => Promise<void>;
}

export function UserMenu({ user, signOut }: UserMenuProps) {
    const initials =
        user.name
            ?.split(' ')
            .map((n) => {
                return n[0];
            })
            .join('')
            .toUpperCase() ??
        user.email?.[0]?.toUpperCase() ??
        '?';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    size="lg"
                >
                    <Avatar className="size-8 rounded-lg">
                        <AvatarImage alt={user.name ?? 'User'} src={user.image ?? undefined} />
                        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.name ?? 'User'}</span>
                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    </div>
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="size-8 rounded-lg">
                            <AvatarImage alt={user.name ?? 'User'} src={user.image ?? undefined} />
                            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name ?? 'User'}</span>
                            <span className="truncate text-xs text-muted-foreground">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <IconSettings className="mr-2 size-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <IconUser className="mr-2 size-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <form action={signOut} className="w-full">
                        <button className="flex w-full items-center" type="submit">
                            <IconLogout className="mr-2 size-4" />
                            Sign out
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
