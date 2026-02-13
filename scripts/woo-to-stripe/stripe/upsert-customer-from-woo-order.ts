import { upsertCustomer as upsertStripeCustomer } from "@/lib/stripe/sdk";
import { stripe } from "@/scripts/woo-to-stripe/stripe/client";
import { CustomerMetadata } from "@/lib/schemas/customer-metadata-schema";
import { WooOrder } from "@/scripts/woo-to-stripe/woo-commerce/types/woo-order";

export async function upsertCustomerFromWooOrder(order: WooOrder): Promise<string | undefined> {
  if (!order.billing.email) {
    console.warn(`Could not find customer for order ${order.billing.email}`);
    return;
  }

  return upsertStripeCustomer(stripe, {
    email: order.billing.email,
    name: `${order.billing.first_name} ${order.billing.last_name}`,
    locale: "en",
    billingAddress: {
      line1: order.billing.address_1,
      line2: order.billing.address_2 || undefined,
      city: order.billing.city,
      postal_code: order.billing.postcode,
      state: order.billing.state || undefined,
      country: order.billing.country,
    },
    shipping: {
      name: `${order.billing.first_name} ${order.billing.last_name}`,
      address: {
        line1: order.shipping.address_1,
        line2: order.shipping.address_2 || undefined,
        city: order.shipping.city,
        postal_code: order.shipping.postcode,
        state: order.shipping.state || undefined,
        country: order.shipping.country,
      },
      phone: order.billing.phone || undefined,
    },
    metadata: {
      locale: "en",
    } satisfies CustomerMetadata,
  });
}
