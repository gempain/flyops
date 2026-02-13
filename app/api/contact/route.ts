import { contactFormSchema, contactResponseSchema } from "@/lib/schemas/contact-schema";
import { createRoute } from "@/lib/api/create-route";
import { sendAdminNotification } from "@/lib/email/templates/admin-notification/admin-notification";
import { sendUserConfirmation } from "@/lib/email/templates/user-confirmation/user-confirmation";
import { privateEnv } from "@/lib/env/private-env";
import { verifyRecaptcha } from "@/lib/captcha/verify-recaptcha";
import { TranslatableError } from "@/lib/api/translatable-error";

export const POST = createRoute({
  validators: {
    body: contactFormSchema,
    response: contactResponseSchema,
  },
  handler: async ({ body }) => {
    const { name, email, phone, subject, message, locale, captchaToken } = body;

    const isCaptchaValid = await verifyRecaptcha(captchaToken);
    if (!isCaptchaValid) {
      throw new TranslatableError("errors.invalidCaptcha", undefined, 400);
    }

    await Promise.all([
      sendAdminNotification({
        to: privateEnv.ADMIN_EMAIL,
        name,
        email,
        phone,
        subject,
        message,
        locale: privateEnv.ADMIN_EMAIL_LOCALE,
      }),
      sendUserConfirmation({
        to: email,
        name,
        message,
        locale,
      }),
    ]);

    return { success: true, message: "Email sent successfully" };
  },
});
