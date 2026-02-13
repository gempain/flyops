import { z } from "zod";
import { $locale } from "@/lib/locale";
import Stripe from "stripe";
import { TranslatableError } from "@/lib/api/translatable-error";

export const $customerRoleEnum = z.union([z.literal("revendeur"), z.literal("particulier")]);

export type CustomerRoleEnum = z.infer<typeof $customerRoleEnum>;

export const $customerRole = z.union([$customerRoleEnum, z.string()]).optional();

const customerMetadataSchema = z.object({
  locale: $locale,
  role: $customerRole,
});

export type CustomerMetadata = z.infer<typeof customerMetadataSchema>;

export function validateCustomerMetadata(customer: Stripe.Customer): CustomerMetadata {
  const { data, success, error } = customerMetadataSchema.safeParse(customer.metadata);

  if (!success) {
    throw new TranslatableError("errors.invalidMetadata", {
      type: "customer",
      id: customer.id,
      validation: error.issues.map((i) => `${i.path}: ${i.message}`).join("\n"),
    });
  }

  return data;
}
