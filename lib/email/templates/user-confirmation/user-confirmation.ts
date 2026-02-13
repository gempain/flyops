import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export async function sendUserConfirmation({
  to,
  name,
  message,
  locale,
}: {
  to: string;
  name: string;
  message: string;
  locale: Locale;
}) {
  await renderAndSendEmail({
    to,
    subjectKey: "contact.email.confirmationSubject",
    locale,
    data: { name, message },
    loaders: {
      id: "user-confirmation",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
