import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export async function sendNewsletterUnsubscribeConfirm({
  to,
  unsubscribeUrl,
  locale,
}: {
  to: string;
  unsubscribeUrl: string;
  locale: Locale;
}) {
  await renderAndSendEmail({
    to,
    subjectKey: "newsletter.email.unsubscribeConfirmSubject",
    locale,
    data: { unsubscribeUrl },
    loaders: {
      id: "newsletter-unsubscribe-confirm",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
