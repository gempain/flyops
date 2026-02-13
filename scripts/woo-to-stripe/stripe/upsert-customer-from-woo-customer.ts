import { upsertCustomer as upsertStripeCustomer } from "@/lib/stripe/sdk";
import { stripe } from "@/scripts/woo-to-stripe/stripe/client";
import { CustomerMetadata } from "@/lib/schemas/customer-metadata-schema";
import { WooCustomer } from "@/scripts/woo-to-stripe/woo-commerce/types/woo-customer";

export async function upsertCustomerFromWooCustomer(wooCustomer: WooCustomer): Promise<string> {
  return upsertStripeCustomer(stripe, {
    email: wooCustomer.email,
    name: `${wooCustomer.first_name} ${wooCustomer.last_name}`,
    locale: "en",
    billingAddress: {
      line1: wooCustomer.billing.address_1,
      line2: wooCustomer.billing.address_2 || undefined,
      city: wooCustomer.billing.city,
      postal_code: wooCustomer.billing.postcode,
      state: wooCustomer.billing.state || undefined,
      country: wooCustomer.billing.country,
    },
    shipping: {
      name: `${wooCustomer.first_name} ${wooCustomer.last_name}`,
      address: {
        line1: wooCustomer.shipping.address_1,
        line2: wooCustomer.shipping.address_2 || undefined,
        city: wooCustomer.shipping.city,
        postal_code: wooCustomer.shipping.postcode,
        state: wooCustomer.shipping.state || undefined,
        country: wooCustomer.shipping.country,
      },
      phone: wooCustomer.billing.phone || undefined,
    },
    metadata: {
      locale: "en",
      ...(wooCustomer.role ? { role: wooCustomer.role } : {}),
    } satisfies CustomerMetadata,
  });
}
