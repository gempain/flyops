import { z } from "zod";
import { $customerRole, $customerRoleEnum } from "@/lib/schemas/customer-metadata-schema";

export const customersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  role: z.union([$customerRoleEnum, z.literal("")]).optional(),
});

export const customerSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  role: $customerRole,
  createdAt: z.string(),
});

export const customersResponseSchema = z.object({
  customers: z.array(customerSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const updateCustomerRoleSchema = z.object({
  role: $customerRoleEnum,
});

export const updateCustomerRoleResponseSchema = customerSchema;

export type CustomersQuery = z.infer<typeof customersQuerySchema>;
export type Customer = z.infer<typeof customerSchema>;
export type CustomersResponse = z.infer<typeof customersResponseSchema>;
export type UpdateCustomerRole = z.infer<typeof updateCustomerRoleSchema>;
export type UpdateCustomerRoleResponse = z.infer<typeof updateCustomerRoleResponseSchema>;
