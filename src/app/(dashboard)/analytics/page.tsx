import { AppHeader } from '@/presentation/ui/organisms/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/ui/card';

export default function AnalyticsPage() {
    return (
        <>
            <AppHeader title="Analytics" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Analytics</CardTitle>
                        <CardDescription>
                            Track your agents' performance and earnings over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                            No analytics data available yet
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
