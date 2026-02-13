import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/db";
import { privateEnv } from "@/lib/env/private-env";
import { sendEmailVerification } from "@/lib/email/templates/auth-email-verification/auth-email-verification";
import { sendPasswordReset } from "@/lib/email/templates/auth-password-reset/auth-password-reset";
import { role } from "@/lib/auth/role";
import { $locale, Locale } from "@/lib/locale";
import { stripe } from "@/lib/stripe/client";
import { validateCustomerMetadata } from "@/lib/schemas/customer-metadata-schema";

async function getLocale(email: string, request: Request | undefined): Promise<Locale> {
  const {
    data: [customer],
  } = await stripe.customers.list({ email: email, limit: 1 });

  if (customer) {
    try {
      const { locale } = validateCustomerMetadata(customer);
      return locale;
    } catch {
      return "fr";
    }
  }

  const localFromHeaders = $locale.safeParse(
    request?.headers.get("accept-language")?.split(",")[0]?.split("-")[0],
  ).data;

  return localFromHeaders || "en";
}

export const auth = betterAuth({
  baseURL: privateEnv.BETTER_AUTH_URL,
  secret: privateEnv.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: privateEnv.GOOGLE_CLIENT_ID || "",
      clientSecret: privateEnv.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(privateEnv.GOOGLE_CLIENT_ID && privateEnv.GOOGLE_CLIENT_SECRET),
    },
  },
  user: {
    additionalFields: {
      role: {
        type: role.options,
        returned: true,
        defaultValue: null,
        input: false,
      },
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }, request: Request | undefined) => {
      const locale = await getLocale(user.email, request);

      const urlObj = new URL(url);
      const token = urlObj.searchParams.get("token");
      const baseUrl = privateEnv.BETTER_AUTH_URL || "http://localhost:3000";
      const verificationUrl = `${baseUrl}/${locale}/auth/verify-email?token=${token}`;

      await sendEmailVerification({
        to: user.email,
        name: user.name,
        verificationUrl,
        locale,
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }, request) => {
      const locale = await getLocale(user.email, request);

      await sendPasswordReset({
        to: user.email,
        resetUrl: url,
        locale,
      });
    },
  },
});
