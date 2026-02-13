"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { verifyEmail } from "@/lib/auth/client";
import { PageContainer } from "@/components/PageContainer";

export default function VerifyEmailPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const token = searchParams?.get("token") || null;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const _verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage(t("invalidLink"));
        return;
      }

      try {
        const response = await verifyEmail({
          query: {
            token,
            callbackURL: `/${locale}/auth/verify-email`,
          },
        });

        if (!response.error) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(t("invalidLink"));
        }
      } catch {
        setStatus("error");
        setErrorMessage(t("verificationError"));
      }
    };

    _verifyEmail();
  }, [token, router, t, locale]);

  return (
    <PageContainer className="flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />}
            {status === "success" && <CheckCircle className="w-16 h-16 text-green-600" />}
            {status === "error" && <XCircle className="w-16 h-16 text-red-600" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === "loading" && t("verifyingEmail")}
            {status === "success" && t("emailVerified")}
            {status === "error" && t("verificationFailed")}
          </CardTitle>
          <CardDescription>
            {status === "loading" && t("pleaseWait")}
            {status === "success" && t("emailVerifiedSuccess")}
            {status === "error" && errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">{t("redirectingToLogin")}</p>
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
