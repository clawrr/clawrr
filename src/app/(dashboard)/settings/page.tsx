'use client';

import { useEffect, useState } from 'react';
import { IconCopy, IconRefresh, IconEye, IconEyeOff } from '@tabler/icons-react';

import { AppHeader } from '@/presentation/ui/organisms/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/ui/card';
import { Button } from '@/presentation/ui/button';
import { Input } from '@/presentation/ui/input';
import { Separator } from '@/presentation/ui/separator';

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [showApiKey, setShowApiKey] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchApiKey();
    }, []);

    const fetchApiKey = async () => {
        try {
            const response = await fetch('/api/v1/user/api-key');
            if (response.ok) {
                const data = await response.json();
                setApiKey(data.apiKey);
            }
        } catch (error) {
            console.error('Failed to fetch API key:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const regenerateApiKey = async () => {
        if (
            !confirm(
                'Are you sure you want to regenerate your API key? All existing integrations will stop working.',
            )
        ) {
            return;
        }

        setIsRegenerating(true);
        try {
            const response = await fetch('/api/v1/user/api-key', {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.json();
                setApiKey(data.apiKey);
                setShowApiKey(true);
            }
        } catch (error) {
            console.error('Failed to regenerate API key:', error);
        } finally {
            setIsRegenerating(false);
        }
    };

    const copyToClipboard = async () => {
        if (apiKey) {
            await navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const maskedKey = apiKey ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` : '';

    return (
        <>
            <AppHeader title="Settings" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>API Key</CardTitle>
                        <CardDescription>
                            Use this key to authenticate programmatic access to Clawrr
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Your API Key</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        value={
                                            isLoading
                                                ? 'Loading...'
                                                : showApiKey
                                                  ? (apiKey ?? '')
                                                  : maskedKey
                                        }
                                        readOnly
                                        className="font-mono pr-20"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => setShowApiKey(!showApiKey)}
                                            disabled={isLoading || !apiKey}
                                        >
                                            {showApiKey ? (
                                                <IconEyeOff className="size-4" />
                                            ) : (
                                                <IconEye className="size-4" />
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={copyToClipboard}
                                            disabled={isLoading || !apiKey}
                                        >
                                            <IconCopy className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {copied && (
                                <p className="text-xs text-green-600">Copied to clipboard!</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Use this key in the Authorization header:{' '}
                                <code className="bg-muted px-1 rounded">
                                    Bearer {'<your-api-key>'}
                                </code>
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={regenerateApiKey}
                                disabled={isRegenerating}
                            >
                                <IconRefresh
                                    className={`mr-2 size-4 ${isRegenerating ? 'animate-spin' : ''}`}
                                />
                                {isRegenerating ? 'Regenerating...' : 'Regenerate Key'}
                            </Button>
                        </div>

                        <div className="rounded-md bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400">
                            <strong>Keep your API key secret.</strong> Anyone with this key can
                            manage your agents and access your account programmatically.
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Publisher Profile</CardTitle>
                        <CardDescription>Manage your publisher account settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="handle" className="text-sm font-medium">
                                Handle
                            </label>
                            <Input id="handle" placeholder="@your-handle" disabled />
                            <p className="text-xs text-muted-foreground">
                                Your unique identifier on Clawrr
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Display Name
                            </label>
                            <Input id="name" placeholder="Your Name or Organization" />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="website" className="text-sm font-medium">
                                Website
                            </label>
                            <Input id="website" placeholder="https://example.com" />
                        </div>

                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Billing</CardTitle>
                        <CardDescription>
                            Configure your payment wallet for receiving funds
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="wallet" className="text-sm font-medium">
                                Wallet Address (Base Network)
                            </label>
                            <Input id="wallet" placeholder="0x..." />
                            <p className="text-xs text-muted-foreground">
                                USDC payments will be sent to this address via x402
                            </p>
                        </div>

                        <Button>Update Wallet</Button>
                    </CardContent>
                </Card>

                <Separator />

                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>Irreversible actions for your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive">Delete Account</Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
