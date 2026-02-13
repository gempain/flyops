import { z } from "zod";
import { orderSchema } from "./orders-schema";

export const adminOrdersQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  shippingStatus: z.string().optional(),
});

export type AdminOrdersQuery = z.infer<typeof adminOrdersQuerySchema>;

export const adminOrdersResponseSchema = z.object({
  orders: z.array(orderSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type AdminOrdersResponse = z.infer<typeof adminOrdersResponseSchema>;

export const updateOrderSchema = z.object({
  shippingStatus: z.string().nullable().optional(),
  trackingNumber: z.string().nullable().optional(),
  trackingUrl: z.string().nullable().optional(),
  carrierName: z.string().nullable().optional(),
  sendcloudOrderId: z.string().nullable().optional(),
});

export type UpdateOrder = z.infer<typeof updateOrderSchema>;

export const updateOrderResponseSchema = z.object({
  success: z.boolean(),
  order: orderSchema,
});

export type UpdateOrderResponse = z.infer<typeof updateOrderResponseSchema>;
