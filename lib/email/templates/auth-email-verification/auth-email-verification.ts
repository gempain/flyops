import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export async function sendEmailVerification({
  to,
  verificationUrl,
  locale,
  name
}: {
  to: string;
  verificationUrl: string;
  name: string;
  locale: Locale;
}) {
  await renderAndSendEmail({
    to,
    subjectKey: "auth.emailMessages.verificationSubject",
    locale,
    data: { verificationUrl, name },
    loaders: {
      id: "auth-email-verification",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
