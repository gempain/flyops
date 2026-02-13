"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, KeyRound, Loader2, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPassword } from "@/lib/auth/client";
import { PageContainer } from "@/components/PageContainer";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || null;
  const [status, setStatus] = useState<"form" | "loading" | "success" | "error">(() => (token ? "form" : "error"));
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setStatus("loading");

    try {
      await resetPassword({
        token: token!,
        newPassword: data.password,
      });

      setStatus("success");
    } catch (error: unknown) {
      setStatus("error");

      if ((error as Error)?.message?.toLowerCase().includes("expired")) {
        setErrorMessage(t("expiredResetLink"));
      } else {
        setErrorMessage(t("invalidResetLink"));
      }
    }
  };

  return (
    <PageContainer className="flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "form" && <KeyRound className="w-16 h-16 text-blue-600" />}
            {status === "loading" && <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />}
            {status === "success" && <CheckCircle className="w-16 h-16 text-green-600" />}
            {status === "error" && <XCircle className="w-16 h-16 text-red-600" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === "form" && t("resetPasswordTitle")}
            {status === "loading" && t("resettingPassword")}
            {status === "success" && t("passwordResetSuccess")}
            {status === "error" && t("passwordResetFailed")}
          </CardTitle>
          <CardDescription>
            {status === "form" && t("resetPasswordDescription")}
            {status === "loading" && t("pleaseWaitReset")}
            {status === "success" && t("passwordResetSuccessMessage")}
            {status === "error" && (errorMessage || t("invalidResetLink"))}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "form" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input id="password" type="password" placeholder={t("passwordPlaceholder")} {...register("password")} />
                {formErrors.password && <p className="text-sm text-red-600">{formErrors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("confirmPasswordPlaceholder")}
                  {...register("confirmPassword")}
                />
                {formErrors.confirmPassword && (
                  <p className="text-sm text-red-600">{formErrors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                {t("resetPasswordButton")}
              </Button>
            </form>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">{t("redirectingToLogin")}</p>
              {/*FIXME: include locale in URL*/}
              <Link href="/auth/login">
                <Button className="w-full">{t("goToLogin")}</Button>
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    {t("tryToLogin")}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="ghost" className="w-full">
                    {t("createNewAccount")}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
