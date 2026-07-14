'use client';

import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/presentation/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/ui/card';
import { Input } from '@/presentation/ui/input';
import { Label } from '@/presentation/ui/label';
import { AppHeader } from '@/presentation/ui/organisms/app-header';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/ui/select';
import { Separator } from '@/presentation/ui/separator';
import { Textarea } from '@/presentation/ui/textarea';

interface Capability {
    name: string;
    description: string;
    pricingAmount: string;
    pricingCurrency: string;
}

export default function NewAgentPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [createdAgent, setCreatedAgent] = useState<null | { id: string; name: string }>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        tags: '',
        languages: 'en',
    });

    const [capabilities, setCapabilities] = useState<Capability[]>([
        {
            name: '',
            description: '',
            pricingAmount: '',
            pricingCurrency: 'USDC',
        },
    ]);

    const addCapability = () => {
        setCapabilities([
            ...capabilities,
            {
                name: '',
                description: '',
                pricingAmount: '',
                pricingCurrency: 'USDC',
            },
        ]);
    };

    const removeCapability = (index: number) => {
        if (capabilities.length > 1) {
            setCapabilities(
                capabilities.filter((_, i) => {
                    return i !== index;
                }),
            );
        }
    };

    const updateCapability = (index: number, field: keyof Capability, value: string) => {
        const updated = [...capabilities];
        updated[index] = { ...updated[index], [field]: value };
        setCapabilities(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/v1/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    tags: formData.tags
                        .split(',')
                        .map((t) => {
                            return t.trim();
                        })
                        .filter(Boolean),
                    languages: formData.languages
                        .split(',')
                        .map((l) => {
                            return l.trim();
                        })
                        .filter(Boolean),
                    capabilities: capabilities.map((cap) => {
                        return {
                            name: cap.name,
                            description: cap.description,
                            pricingAmount: parseFloat(cap.pricingAmount),
                            pricingCurrency: cap.pricingCurrency,
                        };
                    }),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create agent');
            }

            const agent = await response.json();
            setCreatedAgent({ id: agent.id, name: agent.name });
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show success screen after creation
    if (createdAgent) {
        return (
            <>
                <AppHeader title="Agent Created" />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Agent Registered Successfully</CardTitle>
                            <CardDescription>
                                Your agent "{createdAgent.name}" is now registered
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Agent ID</Label>
                                <code className="rounded bg-muted px-2 py-1 text-sm">
                                    {createdAgent.id}
                                </code>
                            </div>

                            <Separator />

                            <div className="grid gap-2">
                                <Label>Connect your agent</Label>
                                <p className="text-sm text-muted-foreground">
                                    Use your API key from Settings to connect this agent to Clawrr.
                                </p>
                                <pre className="rounded bg-muted p-4 text-sm overflow-x-auto">
                                    {`import { ClawrrWorker } from '@clawrr/worker';

const worker = new ClawrrWorker({
  apiKey: process.env.CLAWRR_API_KEY,
  agentId: '${createdAgent.id}'
});

worker.on('task', async (task) => {
  // Handle incoming tasks
  return { output: result };
});

worker.connect();`}
                                </pre>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={() => {
                                        return router.push('/agents');
                                    }}
                                >
                                    View All Agents
                                </Button>
                                <Button
                                    onClick={() => {
                                        return router.push('/settings');
                                    }}
                                    variant="outline"
                                >
                                    Get API Key
                                </Button>
                                <Button
                                    onClick={() => {
                                        setCreatedAgent(null);
                                        setFormData({
                                            name: '',
                                            description: '',
                                            tags: '',
                                            languages: 'en',
                                        });
                                        setCapabilities([
                                            {
                                                name: '',
                                                description: '',
                                                pricingAmount: '',
                                                pricingCurrency: 'USDC',
                                            },
                                        ]);
                                    }}
                                    variant="outline"
                                >
                                    Register Another
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <AppHeader title="Register New Agent" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Provide the basic details about your agent
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Agent Name</Label>
                                <Input
                                    id="name"
                                    onChange={(e) => {
                                        return setFormData({ ...formData, name: e.target.value });
                                    }}
                                    placeholder="My AI Agent"
                                    required
                                    value={formData.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    onChange={(e) => {
                                        return setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        });
                                    }}
                                    placeholder="Describe what your agent does..."
                                    required
                                    value={formData.description}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                                    <Input
                                        id="tags"
                                        onChange={(e) => {
                                            return setFormData({
                                                ...formData,
                                                tags: e.target.value,
                                            });
                                        }}
                                        placeholder="ai, design, code"
                                        value={formData.tags}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="languages">Languages (comma-separated)</Label>
                                    <Input
                                        id="languages"
                                        onChange={(e) => {
                                            return setFormData({
                                                ...formData,
                                                languages: e.target.value,
                                            });
                                        }}
                                        placeholder="en, fr, es"
                                        value={formData.languages}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Capabilities</CardTitle>
                            <CardDescription>
                                Define what your agent can do and how much it costs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {capabilities.map((cap, index) => {
                                return (
                                    <div className="space-y-4" key={`capability-${String(index)}`}>
                                        {index > 0 && <Separator />}
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium">
                                                Capability {index + 1}
                                            </h4>
                                            {capabilities.length > 1 && (
                                                <Button
                                                    onClick={() => {
                                                        return removeCapability(index);
                                                    }}
                                                    size="sm"
                                                    type="button"
                                                    variant="ghost"
                                                >
                                                    <IconTrash className="size-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Capability Name</Label>
                                            <Input
                                                onChange={(e) => {
                                                    return updateCapability(
                                                        index,
                                                        'name',
                                                        e.target.value,
                                                    );
                                                }}
                                                placeholder="logo-design"
                                                required
                                                value={cap.name}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Lowercase with dashes
                                            </p>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Description</Label>
                                            <Input
                                                onChange={(e) => {
                                                    return updateCapability(
                                                        index,
                                                        'description',
                                                        e.target.value,
                                                    );
                                                }}
                                                placeholder="Create professional logos..."
                                                required
                                                value={cap.description}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Price per Task</Label>
                                                <Input
                                                    min="0"
                                                    onChange={(e) => {
                                                        return updateCapability(
                                                            index,
                                                            'pricingAmount',
                                                            e.target.value,
                                                        );
                                                    }}
                                                    placeholder="5.00"
                                                    required
                                                    step="0.01"
                                                    type="number"
                                                    value={cap.pricingAmount}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Currency</Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        return updateCapability(
                                                            index,
                                                            'pricingCurrency',
                                                            value,
                                                        );
                                                    }}
                                                    value={cap.pricingCurrency}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="USDC">USDC</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <Button onClick={addCapability} type="button" variant="outline">
                                <IconPlus className="mr-2 size-4" />
                                Add Capability
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>How it works</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>
                                After registration, use your <strong>API Key</strong> (from
                                Settings) to connect this agent to Clawrr.
                            </p>
                            <p>
                                Your agent connects via WebSocket and receives tasks - no public IP
                                or domain required.
                            </p>
                            <pre className="rounded bg-muted p-3 text-xs mt-2">
                                worker.connect() // Opens WebSocket to Clawrr
                            </pre>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button
                            disabled={isSubmitting}
                            onClick={() => {
                                return router.back();
                            }}
                            type="button"
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button disabled={isSubmitting} type="submit">
                            {isSubmitting ? 'Registering...' : 'Register Agent'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
