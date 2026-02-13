import { z } from "zod";

export const invoiceParamsSchema = z.object({
  invoiceId: z.string(),
});

const $shippingRate = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  display_name: z.string(),
  carrier_name: z.string(),
  real_cost: z.number(),
});

export type ShippingRate = z.infer<typeof $shippingRate>;

export const invoiceShippingOptionsResponseSchema = z.object({
  shipping_rates: z.array($shippingRate),
});

export type InvoiceShippingOptionsResponse = z.infer<typeof invoiceShippingOptionsResponseSchema>;

export const updateInvoiceShippingRequestSchema = z.object({
  shipping_rate_id: z.string(),
});

export type UpdateInvoiceShippingRequest = z.infer<typeof updateInvoiceShippingRequestSchema>;

export const applyInvoiceDiscountsResponseSchema = z.object({
  appliedCoupons: z.number(),
});

export type ApplyInvoiceDiscountsResponse = z.infer<typeof applyInvoiceDiscountsResponseSchema>;
