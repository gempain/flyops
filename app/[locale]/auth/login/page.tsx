"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { requestPasswordReset, sendVerificationEmail, signIn, useSession } from "@/lib/auth/client";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recaptcha } from "@/components/ui/recaptcha";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageContainer } from "@/components/PageContainer";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { data: session } = useSession();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const email = watch("email");

  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      await sendVerificationEmail({
        email,
        callbackURL: `/${locale}/auth/verify-email`,
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async () => {
      await requestPasswordReset({
        email,
        redirectTo: `/${locale}/auth/reset-password`,
      });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!captchaToken) {
      setError(t("captchaRequired"));
      return;
    }

    setError("");
    setShowResendVerification(false);
    setShowForgotPassword(false);
    resendVerificationMutation.reset();
    forgotPasswordMutation.reset();
    setIsLoading(true);

    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onRequest: () => {
            console.log("Signing in...");
          },
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            setCaptchaToken(null);
            recaptchaRef.current?.reset();
            const errorMessage = ctx.error.message || t("loginError");
            setError(errorMessage);

            if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
              setShowResendVerification(true);
            }

            if (ctx.error.code === "INVALID_EMAIL_OR_PASSWORD") {
              setShowForgotPassword(true);
            }
          },
        },
      );
    } catch {
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
      setError(t("loginError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (session) {
    return null;
  }

  return (
    <PageContainer className="flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t("loginTitle")}</CardTitle>
          <CardDescription className="text-center">{t("loginDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && !showResendVerification && !showForgotPassword && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {error && (
              <div className="space-y-2">
                {showResendVerification && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("emailNotVerified")}</AlertTitle>
                    <AlertDescription className="mt-2 space-y-3">
                      {resendVerificationMutation.isSuccess ? (
                        <p className="text-xs text-green-600">{t("verificationEmailSent")}</p>
                      ) : (
                        <>
                          <p className="text-xs">
                            Please check your email for the verification link, or request a new one below.
                          </p>
                          <Button
                            onClick={() => resendVerificationMutation.mutate()}
                            disabled={resendVerificationMutation.isPending}
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            type="button"
                          >
                            {resendVerificationMutation.isPending ? t("loading") : t("resendVerification")}
                          </Button>
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                {showForgotPassword && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("forgotPassword")}</AlertTitle>
                    <AlertDescription className="mt-2 space-y-3">
                      {forgotPasswordMutation.isSuccess ? (
                        <p className="text-xs text-green-600">{t("resetPasswordEmailSent")}</p>
                      ) : (
                        <>
                          <p className="text-xs">{t("forgotPasswordText")}</p>
                          <Button
                            onClick={() => forgotPasswordMutation.mutate()}
                            disabled={forgotPasswordMutation.isPending}
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            type="button"
                          >
                            {forgotPasswordMutation.isPending ? t("loading") : t("resetPasswordLink")}
                          </Button>
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                {...register("email")}
                disabled={isLoading}
              />
              {formErrors.email && <p className="text-sm text-red-600">{formErrors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                {...register("password")}
                disabled={isLoading}
              />
              {formErrors.password && <p className="text-sm text-red-600">{formErrors.password.message}</p>}
            </div>
            <div>
              <Recaptcha
                ref={recaptchaRef}
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
                onErrored={() => setCaptchaToken(null)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button type="submit" className="w-full" disabled={isLoading || !captchaToken}>
              {isLoading ? t("loading") : t("loginButton")}
            </Button>

            <div className="flex items-center justify-center">
              <span className="text-xs uppercase text-gray-500">{t("orContinueWith")}</span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t("continueWithGoogle")}
            </Button>

            <p className="text-sm text-center text-gray-600">
              {t("noAccount")}{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                {t("signupLink")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </PageContainer>
  );
}
