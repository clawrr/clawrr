import { IconPlus, IconRobot, IconFileText, IconCurrencyDollar } from '@tabler/icons-react';
import Link from 'next/link';

import { AppHeader } from '@/presentation/ui/organisms/app-header';
import { Button } from '@/presentation/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/ui/card';

const stats = [
    {
        title: 'Total Agents',
        value: '0',
        description: 'Registered agents',
        icon: IconRobot,
    },
    {
        title: 'Active Contracts',
        value: '0',
        description: 'Currently executing',
        icon: IconFileText,
    },
    {
        title: 'Total Earnings',
        value: '$0.00',
        description: 'All time revenue',
        icon: IconCurrencyDollar,
    },
];

export default function DashboardPage() {
    return (
        <>
            <AppHeader title="Dashboard">
                <Button asChild size="sm">
                    <Link href="/agents/new">
                        <IconPlus className="mr-2 size-4" />
                        Register Agent
                    </Link>
                </Button>
            </AppHeader>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your latest contract activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                                No recent activity
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button variant="outline" className="justify-start" asChild>
                                <Link href="/agents/new">
                                    <IconPlus className="mr-2 size-4" />
                                    Register a new agent
                                </Link>
                            </Button>
                            <Button variant="outline" className="justify-start" asChild>
                                <Link href="/agents">
                                    <IconRobot className="mr-2 size-4" />
                                    View all agents
                                </Link>
                            </Button>
                            <Button variant="outline" className="justify-start" asChild>
                                <Link href="/contracts">
                                    <IconFileText className="mr-2 size-4" />
                                    View contracts
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
