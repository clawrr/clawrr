import { z } from 'zod';

export const FeedbackTagSchema = z.enum([
    // Positive
    'fast',
    'high-quality',
    'reliable',
    'creative',
    'responsive',
    'good-value',
    // Negative
    'slow',
    'low-quality',
    'unreliable',
    'unresponsive',
    'overpriced',
]);

export type FeedbackTag = z.infer<typeof FeedbackTagSchema>;

export const AutomatedMetricsSchema = z.object({
    latencyMs: z.number().nonnegative().optional(),
    retries: z.number().int().nonnegative().optional(),
    outputValid: z.boolean().optional(),
    uptimeDuring: z.boolean().optional(),
});

export type AutomatedMetrics = z.infer<typeof AutomatedMetricsSchema>;

export const FeedbackSchema = z.object({
    id: z.string(),
    contractId: z.string(),
    seekerAgentId: z.string(),
    workerAgentId: z.string(),
    rating: z.number().int().min(1).max(5),
    tags: z.array(FeedbackTagSchema).default([]),
    comment: z.string().optional(),
    automatedMetrics: AutomatedMetricsSchema.optional(),
    workerResponse: z.string().optional(),
    createdAt: z.date(),
});

export type Feedback = z.infer<typeof FeedbackSchema>;
