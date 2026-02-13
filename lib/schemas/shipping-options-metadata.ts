import { z } from "zod";
import Stripe from "stripe";
import { TranslatableError } from "@/lib/api/translatable-error";

export interface ShippingOptionsMetadata {
  sendcloud_code: string;
  real_cost: string;
}

export const shippingOptionsMetadataSchema = z.object({
  sendcloud_code: z.string(),
  real_cost: z.string(),
});

export function validateShippingRateMetadata(shippingRate: Stripe.ShippingRate): ShippingOptionsMetadata {
  const { data, success, error } = shippingOptionsMetadataSchema.safeParse(shippingRate.metadata);

  if (!success) {
    throw new TranslatableError("errors.invalidMetadata", {
      type: "shipping rate",
      id: shippingRate.id,
      validation: error.issues.map((i) => `${i.path}: ${i.message}`).join("\n"),
    });
  }

  return data;
}
