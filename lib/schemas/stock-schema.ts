import { z } from "zod";

export const updateStockSchema = z.object({
  quantity: z.number().int().min(0),
});

export type UpdateStockForm = z.infer<typeof updateStockSchema>;

const stockProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  stockQuantity: z.number(),
});

export type StockProduct = z.infer<typeof stockProductSchema>;

export const stockProductsResponseSchema = z.array(stockProductSchema);

export type StockProductsResponse = z.infer<typeof stockProductsResponseSchema>;
