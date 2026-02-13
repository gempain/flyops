import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export async function sendNewsletterUnsubscribed({ to, name, locale }: { to: string; name: string; locale: Locale }) {
  await renderAndSendEmail({
    to,
    subjectKey: "newsletter.email.unsubscribedSubject",
    locale,
    data: { name },
    loaders: {
      id: "newsletter-unsubscribed",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
