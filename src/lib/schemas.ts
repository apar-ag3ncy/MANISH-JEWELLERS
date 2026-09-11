import { z } from "zod";

// Shared with Route Handlers / Server Actions in Phase 2.

export const newsletterSchema = z.object({
  email: z.string().trim().email(),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const enquirySchema = z.object({
  kind: z.enum(["general", "bespoke", "appointment"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional(),
  productId: z.string().uuid().optional(),
  preferredAt: z.string().datetime().optional(),
  message: z.string().trim().max(2000).optional(),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;
