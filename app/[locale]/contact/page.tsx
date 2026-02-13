"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Recaptcha } from "@/components/ui/recaptcha";
import { type ContactFormInput, contactFormSchema } from "@/lib/schemas/contact-schema";
import { useContactForm } from "@/lib/api/hooks";
import { toast } from "sonner";
import { getTranslatedError } from "@/lib/api/translate-error";
import { PageContainer } from "@/components/PageContainer";

export default function ContactPage() {
  const t = useTranslations();
  const locale = useLocale();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      locale: locale as ContactFormInput["locale"],
      captchaToken: "",
    },
  });

  const contact = useContactForm({
    onSuccess: () => {
      setShowSuccess(true);
      toast.success(t("contact.formSuccess"));
    },
    onError: (error) => {
      setCaptchaToken(null);
      setValue("captchaToken", "");
      recaptchaRef.current?.reset();
      console.log("error", error);
      const errorMessage = getTranslatedError(error, (key, params) => t(key, params));
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ContactFormInput) => {
    contact.mutate({
      ...data,
      locale: (data.locale || locale) as "en" | "fr" | "de" | "nl",
    });
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("contact.title")}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("contact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form or Success Message */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {showSuccess ? (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("contact.successTitle")}</h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">{t("contact.successMessage")}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link href={`/${locale}`}>{t("contact.successCta")}</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setShowSuccess(false);
                        reset();
                        setCaptchaToken(null);
                        setValue("captchaToken", "");
                        recaptchaRef.current?.reset();
                      }}
                    >
                      {t("contact.successSecondary")}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 mb-2 block">
                        {t("contact.formName")} *
                      </Label>
                      <Input id="name" type="text" {...register("name")} className="w-full" />
                      {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700 mb-2 block">
                        {t("contact.formEmail")} *
                      </Label>
                      <Input id="email" type="email" {...register("email")} className="w-full" />
                      {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-gray-700 mb-2 block">
                        {t("contact.formPhone")}
                      </Label>
                      <Input id="phone" type="tel" {...register("phone")} className="w-full" />
                      {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-gray-700 mb-2 block">
                        {t("contact.formSubject")} *
                      </Label>
                      <Input id="subject" type="text" {...register("subject")} className="w-full" />
                      {errors.subject && <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 mb-2 block">
                      {t("contact.formMessage")} *
                    </Label>
                    <Textarea id="message" rows={6} {...register("message")} className="w-full" />
                    {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>}
                  </div>

                  <div>
                    <Recaptcha
                      ref={recaptchaRef}
                      onChange={(token) => {
                        setCaptchaToken(token);
                        setValue("captchaToken", token || "", { shouldValidate: true });
                      }}
                      onExpired={() => {
                        setCaptchaToken(null);
                        setValue("captchaToken", "", { shouldValidate: true });
                      }}
                      onErrored={() => {
                        setCaptchaToken(null);
                        setValue("captchaToken", "", { shouldValidate: true });
                      }}
                    />
                    {errors.captchaToken && <p className="text-sm text-red-600 mt-1">{errors.captchaToken.message}</p>}
                  </div>

                  <div>
                    <Button
                      type="submit"
                      disabled={contact.isPending || !captchaToken}
                      size="lg"
                      className="w-full md:w-auto"
                    >
                      {contact.isPending ? t("contact.formSending") : t("contact.formSubmit")}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("contact.infoTitle")}</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-[#8BC34A] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{t("contact.infoEmail")}</p>
                    <p className="mt-1 text-gray-600">info@flyops.aero</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-[#2196F3] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{t("contact.infoAddress")}</p>
                    <p className="mt-1 text-gray-600">Address</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
