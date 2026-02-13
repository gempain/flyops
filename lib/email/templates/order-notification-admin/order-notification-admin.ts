import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export type LineItem = {
  description: string;
  quantity: number;
  amount: number;
  currency: string;
  formattedAmount: string;
};

export async function sendOrderNotificationAdmin({
  to,
  orderId,
  orderDate,
  invoiceId,
  customerName,
  customerEmail,
  lineItems,
  formattedTotal,
  dashboardUrl,
  locale,
}: {
  to: string;
  orderId: string;
  orderDate: string;
  invoiceId: string;
  customerName: string;
  customerEmail: string;
  lineItems: LineItem[];
  formattedTotal: string;
  dashboardUrl: string;
  locale: Locale;
}) {
  await renderAndSendEmail({
    to,
    subjectKey: "orderEmail.admin.subject",
    locale,
    data: {
      orderId,
      orderDate,
      invoiceId,
      customerName,
      customerEmail,
      lineItems,
      formattedTotal,
      dashboardUrl,
    },
    loaders: {
      id: "order-notification-admin",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
