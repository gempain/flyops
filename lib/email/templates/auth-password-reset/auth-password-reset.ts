import { renderAndSendEmail } from "@/lib/email/base";
import { Locale } from "@/lib/locale";

export async function sendPasswordReset({ to, resetUrl, locale }: { to: string; resetUrl: string; locale: Locale }) {
  await renderAndSendEmail({
    to,
    subjectKey: "auth.emailMessages.passwordResetSubject",
    locale,
    data: { resetUrl },
    loaders: {
      id: "auth-password-reset",
      html: async () => (await import("./html.hbs")).default,
      text: async () => (await import("./text.hbs")).default,
    },
  });
}
