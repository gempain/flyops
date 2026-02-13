import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export async function sendAdminNotification({
  to,
  name,
  email,
  phone,
  subject,
  message,
  locale,
}: {
  to: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  locale: Locale;
}) {
  await renderAndSendEmail({
    to,
    subjectKey: "contact.email.subject",
    locale,
    data: {
      name,
      email,
      phone,
      subject,
      message,
    },
    loaders: {
      id: "admin-notification",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
