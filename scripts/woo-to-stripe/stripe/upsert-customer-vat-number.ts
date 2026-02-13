import { WooCustomer } from "@/scripts/woo-to-stripe/woo-commerce/types/woo-customer";
import { stripe } from "@/scripts/woo-to-stripe/stripe/client";

export async function upsertCustomerVatNumber(wooCustomer: WooCustomer, stripeCustomerId: string) {
  const vatNumber = wooCustomer.meta_data?.find((m) => m.key === "vat_number")?.value as string;
  if (!vatNumber) {
    return;
  }

  const taxIds = await stripe.taxIds.list({
    owner: {
      type: "customer",
      customer: stripeCustomerId,
    },
  });

  if (taxIds.data.some((tid) => tid.value === vatNumber)) {
    return;
  }

  try {
    return await stripe.taxIds.create({
      type: "eu_vat",
      value: vatNumber,
      owner: {
        type: "customer",
        customer: stripeCustomerId,
      },
    });
  } catch (e) {
    console.warn(`Failed to create tax id ${JSON.stringify(vatNumber)} for customer ${stripeCustomerId}`);
  }
}
