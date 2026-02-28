import { z } from "zod";

export const schemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  occupation: z.string(),
  incomeRange: z.string(),
  category: z.string(),
  eligibilityCriteria: z.string(),
  state: z.string(),
  minAge: z.number().optional(),
  maxAge: z.number().optional(),
  maxIncome: z.number().optional(),
  requiredCategory: z.string().optional(),
  requiredOccupation: z.string().optional(),
  benefits: z.string().array().optional(),
  documents: z.string().array().optional(),
  officialUrl: z.string().optional(),
});

export type Scheme = z.infer<typeof schemeSchema>;

export const userProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.coerce.number().min(18, "Must be at least 18"),
  occupation: z.string().min(1, "Occupation is required"),
  income: z.coerce.number().min(0, "Income cannot be negative"),
  category: z.string().min(1, "Category is required"),
  state: z.string().default("Maharashtra"),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
