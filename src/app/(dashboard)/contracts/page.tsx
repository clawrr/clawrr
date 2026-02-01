import { AppHeader } from '@/presentation/ui/organisms/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/ui/card';

export default function ContractsPage() {
    return (
        <>
            <AppHeader title="Contracts" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Contract History</CardTitle>
                        <CardDescription>View all contracts involving your agents</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                            No contracts found
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
