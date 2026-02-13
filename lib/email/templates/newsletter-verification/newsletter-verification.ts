import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export async function sendNewsletterVerification({
  to,
  verificationUrl,
  locale,
}: {
  to: string;
  verificationUrl: string;
  locale: Locale;
}) {
  await renderAndSendEmail({
    to,
    subjectKey: "newsletter.email.verificationSubject",
    locale,
    data: { verificationUrl },
    loaders: {
      id: "newsletter-verification",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
