import { stripe } from "@/lib/stripe/client";
import { validateCustomerMetadata } from "@/lib/schemas/customer-metadata-schema";

export async function searchCoupons(customerId: string) {
  const customer = await stripe.customers.retrieve(customerId);
  if (!customer || customer.deleted) {
    return [];
  }

  const metadata = validateCustomerMetadata(customer);

  const role = metadata.role;
  if (!role) {
    return [];
  }

  const coupons = await stripe.coupons.list({
    limit: 100,
  });

  return coupons.data.filter((coupon) => coupon.metadata?.role === role).map((c) => c.id);
}
