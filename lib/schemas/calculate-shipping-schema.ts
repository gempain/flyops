import { z } from "zod";

export const shippingAddressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional().nullable(),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().length(2, "Country must be a 2-letter ISO code").toUpperCase(),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export const shippingDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: shippingAddressSchema,
});

export type ShippingDetails = z.infer<typeof shippingDetailsSchema>;

export const calculateShippingRequestSchema = z.object({
  checkout_session_id: z
    .string()
    .min(1, "Checkout session ID is required")
    .startsWith("cs_", "Invalid checkout session ID format"),
  shipping_details: shippingDetailsSchema,
});

export type CalculateShippingRequest = z.infer<typeof calculateShippingRequestSchema>;

export const calculateShippingSuccessSchema = z.object({
  type: z.literal("object"),
  value: z.object({
    succeeded: z.boolean(),
    shipping_rates: z.array(
      z.object({
        id: z.string(),
        amount: z.number(),
        currency: z.string(),
        display_name: z.string(),
      }),
    ),
  }),
});

export const calculateShippingErrorSchema = z.object({
  type: z.literal("error"),
  message: z.string(),
});

export const calculateShippingResponseSchema = z.union([calculateShippingSuccessSchema, calculateShippingErrorSchema]);

export type CalculateShippingResponse = z.infer<typeof calculateShippingResponseSchema>;
