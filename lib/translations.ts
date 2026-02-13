import { Locale } from "@/lib/locale";
import enMessages from "@/messages/en.json";
import frMessages from "@/messages/fr.json";
import deMessages from "@/messages/de.json";
import nlMessages from "@/messages/nl.json";

export type Messages = typeof enMessages;

const translationsMap: Record<Locale, Messages> = {
  en: enMessages,
  fr: frMessages,
  de: deMessages,
  nl: nlMessages,
};

export function loadTranslations(locale: Locale): Messages {
  return translationsMap[locale] || enMessages;
}
