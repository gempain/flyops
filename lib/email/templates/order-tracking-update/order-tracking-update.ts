import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export async function sendOrderTrackingUpdate({
  to,
  name,
  orderId,
  trackingNumber,
  trackingUrl,
  carrierName,
  contactUrl,
  locale,
}: {
  to: string;
  name: string;
  orderId: string;
  trackingNumber: string;
  trackingUrl?: string;
  carrierName?: string;
  contactUrl: string;
  locale: Locale;
}) {
  await renderAndSendEmail({
    to,
    subjectKey: "trackingEmail.subject",
    locale,
    data: {
      name,
      orderId,
      trackingNumber,
      trackingUrl,
      carrierName,
      contactUrl,
    },
    loaders: {
      id: "order-tracking-update",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
