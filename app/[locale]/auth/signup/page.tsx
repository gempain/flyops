"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { signIn, signUp, useSession } from "@/lib/auth/client";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recaptcha } from "@/components/ui/recaptcha";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageContainer } from "@/components/PageContainer";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { data: session } = useSession();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    if (!captchaToken) {
      setError(t("captchaRequired"));
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onRequest: () => {
            console.log("Creating account...");
          },
          onSuccess: () => {
            setSignupSuccess(true);
          },
          onError: (ctx) => {
            setCaptchaToken(null);
            recaptchaRef.current?.reset();
            setError(ctx.error.message || t("signupError"));
          },
        },
      );
    } catch {
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
      setError(t("signupError"));
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
        {signupSuccess ? (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Mail className="w-16 h-16 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">{t("checkYourEmail")}</CardTitle>
              <CardDescription>{t("verificationEmailSent")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">{t("verificationInstructions")}</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">{t("didntReceiveEmail")}</p>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    {t("goToLogin")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">{t("signupTitle")}</CardTitle>
              <CardDescription className="text-center">{t("signupDescription")}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("namePlaceholder")}
                    {...register("name")}
                    disabled={isLoading}
                  />
                  {formErrors.name && <p className="text-sm text-red-600">{formErrors.name.message}</p>}
                </div>
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("confirmPasswordPlaceholder")}
                    {...register("confirmPassword")}
                    disabled={isLoading}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-red-600">{formErrors.confirmPassword.message}</p>
                  )}
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
                  {isLoading ? t("loading") : t("signupButton")}
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
                  {t("hasAccount")}{" "}
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    {t("loginLink")}
                  </Link>
                </p>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </PageContainer>
  );
}
