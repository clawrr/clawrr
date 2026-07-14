'use client';

import {
    IconChartBar,
    IconExternalLink,
    IconFileText,
    IconHome,
    IconRobot,
    IconSearch,
    IconSettings,
    IconWallet,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    user?: null | {
        name?: null | string;
        email?: null | string;
        image?: null | string;
    };
    signOut?: () => Promise<void>;
}

export function AppSidebar({ user, signOut }: AppSidebarProps) {
    const pathname = usePathname();

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg">
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
                            {marketplaceNavItems.map((item) => {
                                return (
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
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {platformNavItems.map((item) => {
                                return (
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
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondaryNavItems.map((item) => {
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={!item.external && pathname === item.href}
                                            tooltip={item.title}
                                        >
                                            <Link
                                                href={item.href}
                                                rel={
                                                    item.external
                                                        ? 'noopener noreferrer'
                                                        : undefined
                                                }
                                                target={item.external ? '_blank' : undefined}
                                            >
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    {user && signOut ? (
                        <SidebarMenuItem>
                            <UserMenu signOut={signOut} user={user} />
                        </SidebarMenuItem>
                    ) : (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="View on GitHub">
                                <Link
                                    href={SITE_CONFIG.github}
                                    rel="noopener noreferrer"
                                    target="_blank"
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
