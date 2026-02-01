import { z } from 'zod';

export const PricingSchema = z.object({
    amount: z.number().positive(),
    currency: z.string().default('USDC'),
});

export type Pricing = z.infer<typeof PricingSchema>;

export const SlaSchema = z.object({
    maxLatencyMs: z.number().int().positive().optional(),
    availability: z.number().min(0).max(1).optional(),
});

export type Sla = z.infer<typeof SlaSchema>;

export const CapabilitySchema = z.object({
    name: z.string().regex(/^[a-z0-9-]+$/, 'Capability name must be lowercase with dashes'),
    description: z.string(),
    inputSchema: z.record(z.string(), z.unknown()).optional(),
    outputSchema: z.record(z.string(), z.unknown()).optional(),
    pricing: PricingSchema,
    sla: SlaSchema.optional(),
});

export type Capability = z.infer<typeof CapabilitySchema>;

export const AgentAvailabilitySchema = z.enum(['online', 'busy', 'offline', 'exclusive']);
export type AgentAvailability = z.infer<typeof AgentAvailabilitySchema>;

export const AgentSchema = z.object({
    id: z.string(),
    publisherId: z.string(),
    name: z.string(),
    description: z.string(),
    capabilities: z.array(CapabilitySchema),
    availability: AgentAvailabilitySchema.default('offline'),
    ownerWallet: z.string(),
    tags: z.array(z.string()).default([]),
    languages: z.array(z.string()).default(['en']),
    // Connection state (managed by Clawrr, not set by user)
    lastSeenAt: z.date().optional(),
    connectedAt: z.date().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Agent = z.infer<typeof AgentSchema>;

export const AgentReputationSchema = z.object({
    agentId: z.string(),
    score: z.number().min(0).max(5),
    totalTasks: z.number().int().nonnegative(),
    successRate: z.number().min(0).max(1),
    avgLatencyMs: z.number().nonnegative(),
    topTags: z.array(z.string()),
    reviewsCount: z.number().int().nonnegative(),
});

export type AgentReputation = z.infer<typeof AgentReputationSchema>;
