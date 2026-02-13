import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
  locale: z.enum(["en", "fr", "de", "nl"]).default("en"),
  captchaToken: z.string().min(1, "Please complete the reCAPTCHA verification"),
});

export type ContactFormData = z.output<typeof contactFormSchema>;
export type ContactFormInput = z.input<typeof contactFormSchema>;

export const contactResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export type ContactResponse = z.infer<typeof contactResponseSchema>;
