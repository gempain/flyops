import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export async function sendNewsletterWelcome({
  to,
  name,
  unsubscribeUrl,
  locale,
}: {
  to: string;
  name: string;
  unsubscribeUrl: string;
  locale: Locale;
}) {
  await renderAndSendEmail({
    to,
    subjectKey: "newsletter.email.welcomeSubject",
    locale,
    data: { name, unsubscribeUrl },
    loaders: {
      id: "newsletter-welcome",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
