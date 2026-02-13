import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export type LineItem = {
  description: string;
  quantity: number;
  amount: number;
  currency: string;
  formattedAmount: string;
};

export async function sendOrderConfirmationCustomer({
  to,
  name,
  orderId,
  orderDate,
  lineItems,
  formattedTotal,
  trackOrderUrl,
  contactUrl,
  locale,
}: {
  to: string;
  name: string;
  orderId: string;
  orderDate: string;
  lineItems: LineItem[];
  formattedTotal: string;
  trackOrderUrl: string;
  contactUrl: string;
  locale: Locale;
}) {
  await renderAndSendEmail({
    to,
    subjectKey: "orderEmail.customer.subject",
    locale,
    data: {
      name,
      orderId,
      orderDate,
      lineItems,
      formattedTotal,
      trackOrderUrl,
      contactUrl,
    },
    loaders: {
      id: "order-confirmation-customer",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
