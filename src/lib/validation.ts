import { z } from "zod";

export const applicationSchema = z.object({
  applicantName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  dateOfBirth: z.string().min(8),
  address: z.string().min(5).max(200),
  annualIncomeCents: z.number().int().positive(),
  employmentStatus: z.string().min(2).max(80),
  creditScore: z.number().int().min(300).max(850),
});
export const transactionSchema = z.object({
  accountId: z.string().uuid(),
  merchant: z.string().min(2).max(80),
  category: z.string().min(2).max(40),
  description: z.string().max(160).default("Demo purchase"),
  amountCents: z.number().int().positive().max(100000000),
});
