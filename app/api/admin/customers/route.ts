import { stripe } from "@/lib/stripe/client";
import { Customer, customersQuerySchema, customersResponseSchema } from "@/lib/schemas/customer-role-schema";
import { validateCustomerMetadata } from "@/lib/schemas/customer-metadata-schema";
import { createRoute } from "@/lib/api/create-route";
import { adminGuard } from "@/lib/api/guards";
import { z } from "zod";

export const GET = createRoute({
  auth: adminGuard,
  validators: {
    query: customersQuerySchema,
    response: customersResponseSchema,
  },
  handler: async ({ query }) => {
    const validEmail = z.email().safeParse(query.search).success;

    const q = validEmail
      ? `email: '${query.search}'`
      : [query.search ? `name ~ "${query.search}"` : null, query.role ? `metadata['role']: '${query.role}'` : null]
          .filter((v) => v !== null)
          .join(" AND ");

    // TODO how to avoid injections ?
    const customers = await stripe.customers.search({
      query: q || "created > 946684800", // at least one criteria to avoid empty query
      limit: query.limit,
      page: query.page > 1 ? query.page.toFixed() : undefined,
    });

    const mappedCustomers: Customer[] = customers.data.map((customer) => {
      const metadata = validateCustomerMetadata(customer);

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: metadata?.role,
        createdAt: new Date(customer.created * 1000).toISOString(),
      };
    });

    return {
      customers: mappedCustomers,
      total: customers.total_count || 0,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil((customers.total_count || 0) / query.limit),
    };
  },
});
