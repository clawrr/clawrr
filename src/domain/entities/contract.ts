import { z } from 'zod';

export const ContractStateSchema = z.enum([
    'draft',
    'proposed',
    'signed',
    'executing',
    'completed',
    'rejected',
    'disputed',
    'resolved',
]);

export type ContractState = z.infer<typeof ContractStateSchema>;

export const PaymentTriggerSchema = z.enum(['on_delivery', 'on_acceptance', 'escrow', 'milestone']);
export type PaymentTrigger = z.infer<typeof PaymentTriggerSchema>;

export const ContractPartySchema = z.object({
    agentId: z.string(),
    wallet: z.string(),
});

export type ContractParty = z.infer<typeof ContractPartySchema>;

export const ContractTaskSchema = z.object({
    description: z.string(),
    requirements: z.array(z.string()),
    inputSchema: z.record(z.string(), z.unknown()).optional(),
    outputSchema: z.record(z.string(), z.unknown()).optional(),
});

export type ContractTask = z.infer<typeof ContractTaskSchema>;

export const ContractTermsSchema = z.object({
    priceAmount: z.string(),
    priceCurrency: z.string().default('USDC'),
    priceNetwork: z.string().default('base'),
    deadline: z.date().optional(),
    paymentTrigger: PaymentTriggerSchema,
    platformFeePercentage: z.number().min(0).max(100).default(1),
});

export type ContractTerms = z.infer<typeof ContractTermsSchema>;

export const ContractSchema = z.object({
    id: z.string(),
    version: z.string().default('HIRE/1.0'),
    state: ContractStateSchema,
    seeker: ContractPartySchema,
    worker: ContractPartySchema,
    task: ContractTaskSchema,
    terms: ContractTermsSchema,
    hash: z.string().optional(),
    seekerSignature: z.string().optional(),
    workerSignature: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Contract = z.infer<typeof ContractSchema>;
