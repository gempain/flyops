import { Locale } from "@/lib/locale";
import Stripe from "stripe";

export async function upsertCustomer(
  stripe: Stripe,
  {
    email,
    name,
    locale = "en",
    metadata: additionalMetadata,
    billingAddress,
    shipping,
  }: {
    email: string;
    name?: string;
    locale?: Locale;
    metadata?: Record<string, string>;
    billingAddress?: Stripe.AddressParam;
    shipping?: Stripe.CustomerUpdateParams.Shipping;
  },
) {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  const metadata: Record<string, string> = {
    ...additionalMetadata,
  };

  metadata.locale = locale;

  if (customers.data.length > 0) {
    const existingCustomer = customers.data[0];

    await stripe.customers.update(existingCustomer.id, {
      preferred_locales: [locale],
      metadata,
      ...(name && !existingCustomer.name ? { name } : {}),
      address: billingAddress,
      shipping,
    });

    return existingCustomer.id;
  }

  const customer = await stripe.customers.create({
    email,
    preferred_locales: [locale],
    metadata,
    ...(name ? { name } : {}),
    ...(billingAddress ? { address: billingAddress } : {}),
    ...(shipping ? { shipping } : {}),
  });

  return customer.id;
}
