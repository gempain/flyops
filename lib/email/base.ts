import Handlebars from "handlebars";
import i18next, { createInstance } from "i18next";
import { privateEnv } from "@/lib/env/private-env";
import { Locale } from "@/lib/locale";
import { loadTranslations, Messages } from "@/lib/translations";
import { emailClient } from "@/lib/email/email-client";

const templateCache = new Map<string, HandlebarsTemplateDelegate>();
const i18nInstances = new Map<Locale, typeof i18next>();

async function getI18nInstance(locale: Locale) {
  const cached = i18nInstances.get(locale);
  if (cached) {
    return cached;
  }

  const instance = createInstance();

  await instance.init({
    lng: locale,
    resources: {
      [locale]: {
        translation: loadTranslations(locale),
      },
    },
    interpolation: {
      escapeValue: false,
      prefix: "{",
      suffix: "}",
    },
  });

  return instance;
}

async function registerPartials(): Promise<void> {
  if (!Handlebars.partials["layout"]) {
    Handlebars.registerPartial("layout", (await import("./templates/layouts/base.hbs")).default);
  }
}

async function compileTemplate(templateSource: string, locale: Locale): Promise<HandlebarsTemplateDelegate> {
  await registerPartials();

  const template = Handlebars.compile(templateSource);
  const i18n = await getI18nInstance(locale);

  return (context: unknown) => {
    const helpers = {
      t: (key: string, options?: { hash?: Record<string, unknown> }) => {
        const translation = i18n.t(key, options?.hash);
        return new Handlebars.SafeString(translation);
      },
    };

    return template(context, { helpers });
  };
}

type Leaves<T> = T extends object
  ? { [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? "" : `.${Leaves<T[K]>}`}` }[keyof T]
  : never;

export async function renderAndSendEmail({
  to,
  subjectKey,
  locale,
  data,
  loaders,
}: {
  to: string;
  subjectKey: Leaves<Messages>;
  locale: Locale;
  data: Record<string, unknown>;
  loaders: {
    id: string;
    text: () => Promise<string>;
    html?: () => Promise<string>;
  };
}) {
  try {
    const i18n = await getI18nInstance(locale);
    const subject = i18n.t(subjectKey, data);

    const templateData = {
      ...data,
      headerTitle: subject,
    };

    const textSource = await loaders.text();
    const textCacheKey = `${loaders.id}-text-${locale}`;

    let textTemplate = templateCache.get(textCacheKey);
    if (!textTemplate) {
      textTemplate = await compileTemplate(textSource, locale);
      templateCache.set(textCacheKey, textTemplate);
    }

    const text = textTemplate(templateData);

    const sentMessageInfo = await emailClient.sendMail({
      from: privateEnv.SMTP_FROM,
      to,
      subject,
      text,
    });

    console.log(`[Email] Sent email to ${to}, messageId=${sentMessageInfo.messageId}`, sentMessageInfo.messageId);
  } catch (error) {
    console.error(`[Email] Failed to send email to ${to}:`, error);
    throw error;
  }
}
