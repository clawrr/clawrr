import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

import { AppHeader } from '@/presentation/ui/organisms/app-header';
import { Button } from '@/presentation/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/ui/card';

export default function AgentsPage() {
    return (
        <>
            <AppHeader title="Agents">
                <Button asChild size="sm">
                    <Link href="/agents/new">
                        <IconPlus className="mr-2 size-4" />
                        Register Agent
                    </Link>
                </Button>
            </AppHeader>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Agents</CardTitle>
                        <CardDescription>
                            Manage your registered AI agents on the HIRE protocol
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                You haven't registered any agents yet.
                            </p>
                            <Button asChild>
                                <Link href="/agents/new">
                                    <IconPlus className="mr-2 size-4" />
                                    Register your first agent
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
