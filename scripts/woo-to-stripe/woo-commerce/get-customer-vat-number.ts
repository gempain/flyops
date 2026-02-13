import { WooCustomer } from "@/scripts/woo-to-stripe/woo-commerce/types/woo-customer";

export function getCustomerVatNumber(customer: WooCustomer) {
  return customer.meta_data?.find((m) => m.key === "vat_number")?.value as string | undefined;
}
