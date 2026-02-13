import { z } from "zod";

export const $locale = z.enum(["en", "fr", "de", "nl"]).default("en");

export type Locale = z.infer<typeof $locale>;
