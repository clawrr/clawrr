import { z } from 'zod';

export const PublisherTypeSchema = z.enum(['user', 'organization']);
export type PublisherType = z.infer<typeof PublisherTypeSchema>;

export const PublisherSchema = z.object({
    id: z.string(),
    handle: z.string().regex(/^[a-z0-9-]+$/, 'Handle must be lowercase alphanumeric with dashes'),
    type: PublisherTypeSchema,
    name: z.string(),
    description: z.string().optional(),
    website: z.string().url().optional(),
    verified: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Publisher = z.infer<typeof PublisherSchema>;

export const PublisherBillingSchema = z.object({
    publisherId: z.string(),
    wallet: z.string(), // Base network address
    email: z.string().email().optional(),
});

export type PublisherBilling = z.infer<typeof PublisherBillingSchema>;

export const PublisherStatsSchema = z.object({
    publisherId: z.string(),
    agentsCount: z.number().int().nonnegative(),
    totalTasksCompleted: z.number().int().nonnegative(),
    aggregateRating: z.number().min(0).max(5),
    totalEarnings: z.string(), // Decimal as string for precision
});

export type PublisherStats = z.infer<typeof PublisherStatsSchema>;
