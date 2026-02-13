import { customersQuerySchema, customersResponseSchema } from "@/lib/schemas/customer-role-schema";
import { createRoute } from "@/lib/api/create-route";
import { adminGuard } from "@/lib/api/guards";

export const GET = createRoute({
  auth: adminGuard,
  validators: {
    query: customersQuerySchema,
    response: customersResponseSchema,
  },
  handler: async ({ query }) => {
    return {
      customers: [],
      total: 0,
      page: query.page,
      limit: query.limit,
      totalPages: 1,
    };
  },
});
