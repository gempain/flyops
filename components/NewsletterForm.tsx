"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Recaptcha } from "@/components/ui/recaptcha";
import { useNewsletterSubscribe } from "@/lib/api/hooks";
import { type NewsletterSubscribeData } from "@/lib/schemas/newsletter-schema";
import { toast } from "sonner";
import { getTranslatedError } from "@/lib/api/translate-error";

type NewsletterFormData = Omit<NewsletterSubscribeData, "locale">;

export default function NewsletterForm() {
  const t = useTranslations("newsletter");
  const tError = useTranslations();
  const locale = useLocale();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<NewsletterFormData>({
    defaultValues: {
      name: "",
      email: "",
      captchaToken: "",
    },
  });

  const subscribe = useNewsletterSubscribe({
    onSuccess: () => {
      reset();
      setCaptchaToken(null);
      setValue("captchaToken", "");
      recaptchaRef.current?.reset();
      toast.success(t("formSuccess"));
    },
    onError: (error) => {
      setCaptchaToken(null);
      setValue("captchaToken", "");
      recaptchaRef.current?.reset();
      const errorMessage = getTranslatedError(error, (key, params) => tError(key, params));
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: NewsletterFormData) => {
    subscribe.mutate({
      ...data,
      locale: locale as "en" | "fr" | "de" | "nl",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <div className="w-24 h-1 bg-brand-orange mx-auto mb-6"></div>
      <h2 className="text-3xl font-bold text-text-dark mb-4 text-center">{t("title")}</h2>
      <p className="text-gray-600 mb-6 text-center">{t("subtitle")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-gray-700 mb-2 block">
            {t("formName")}
          </Label>
          <Input id="name" type="text" {...register("name")} className="w-full" disabled={subscribe.isPending} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-700 mb-2 block">
            {t("formEmail")}
          </Label>
          <Input id="email" type="email" {...register("email")} className="w-full" disabled={subscribe.isPending} />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
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
            disabled={subscribe.isPending || !captchaToken}
            className="w-full bg-brand-green hover:bg-brand-orange"
            size="lg"
          >
            {subscribe.isPending ? t("formSending") : t("formSubmit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
