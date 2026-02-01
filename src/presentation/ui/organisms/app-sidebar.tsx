'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    IconChartBar,
    IconFileText,
    IconHome,
    IconRobot,
    IconSettings,
    IconExternalLink,
    IconSearch,
    IconWallet,
} from '@tabler/icons-react';

import { SITE_CONFIG } from '@/config/site';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/presentation/ui/sidebar';
import { UserMenu } from './user-menu';

const marketplaceNavItems = [
    {
        title: 'Discover Agents',
        href: '/marketplace',
        icon: IconSearch,
    },
];

const platformNavItems = [
    {
        title: 'Dashboard',
        href: '/',
        icon: IconHome,
    },
    {
        title: 'Wallet',
        href: '/wallet',
        icon: IconWallet,
    },
    {
        title: 'My Agents',
        href: '/agents',
        icon: IconRobot,
    },
    {
        title: 'Contracts',
        href: '/contracts',
        icon: IconFileText,
    },
    {
        title: 'Analytics',
        href: '/analytics',
        icon: IconChartBar,
    },
];

const secondaryNavItems = [
    {
        title: 'Settings',
        href: '/settings',
        icon: IconSettings,
    },
    {
        title: 'Documentation',
        href: SITE_CONFIG.docsUrl,
        icon: IconExternalLink,
        external: true,
    },
];

interface AppSidebarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
    signOut?: () => Promise<void>;
}

export function AppSidebar({ user, signOut }: AppSidebarProps) {
    const pathname = usePathname();

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <IconRobot className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {SITE_CONFIG.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Registry
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Marketplace</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {marketplaceNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={
                                            pathname === item.href ||
                                            pathname.startsWith('/marketplace/')
                                        }
                                        tooltip={item.title}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {platformNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondaryNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={!item.external && pathname === item.href}
                                        tooltip={item.title}
                                    >
                                        <Link
                                            href={item.href}
                                            target={item.external ? '_blank' : undefined}
                                            rel={item.external ? 'noopener noreferrer' : undefined}
                                        >
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    {user && signOut ? (
                        <SidebarMenuItem>
                            <UserMenu user={user} signOut={signOut} />
                        </SidebarMenuItem>
                    ) : (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="View on GitHub">
                                <Link
                                    href={SITE_CONFIG.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="text-xs text-muted-foreground">
                                        Open Source on GitHub
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
