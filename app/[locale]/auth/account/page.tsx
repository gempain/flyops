"use client";

import { requestPasswordReset, sendVerificationEmail, signOut } from "@/lib/auth/client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Calendar, Mail, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { AuthGuard, Session } from "@/components/AuthGuard";
import { PageContainer } from "@/components/PageContainer";

interface AccountContentProps {
  session: Session;
}

function AccountContent({ session }: AccountContentProps) {
  const t = useTranslations("auth");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      await sendVerificationEmail({
        email: session.user.email,
        callbackURL: `/${locale}/auth/verify-email`,
      });
    },
    onSuccess: () => {
      toast.success(t("verificationSent"));
    },
    onError: () => {
      toast.error(t("verificationError"));
    },
  });

  const passwordResetMutation = useMutation({
    mutationFn: async () => {
      await requestPasswordReset({
        email: session.user.email,
        redirectTo: `/${locale}/auth/reset-password`,
      });
    },
    onSuccess: () => {
      toast.success(t("resetEmailSent"));
    },
    onError: () => {
      toast.error(t("resetEmailError"));
    },
  });

  return (
    <PageContainer className="bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("backToHome")}
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{t("accountSettings")}</CardTitle>
            <CardDescription>{t("accountDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-600">{t("nameLabel")}</Label>
                  <p className="text-lg font-medium text-gray-900">{session.user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-600">{t("emailLabel")}</Label>
                  <p className="text-lg font-medium text-gray-900">{session.user.email}</p>
                  {session.user.emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("verified")}
                    </span>
                  ) : (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-amber-600">
                        <AlertCircle className="w-3 h-3" />
                        <span>{t("emailNotVerified")}</span>
                      </div>
                      <Button
                        onClick={() => resendVerificationMutation.mutate()}
                        disabled={resendVerificationMutation.isPending}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        {resendVerificationMutation.isPending ? t("loading") : t("resendVerification")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-600">{t("memberSince")}</Label>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(session.user.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t("security")}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-600">{t("password")}</Label>
                      <p className="text-sm text-gray-500 mt-1">{t("changePasswordDescription")}</p>
                      <Button
                        onClick={() => passwordResetMutation.mutate()}
                        disabled={passwordResetMutation.isPending}
                        size="sm"
                        variant="outline"
                        className="mt-3"
                      >
                        {passwordResetMutation.isPending ? t("loading") : t("changePasswordButton")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <Button onClick={handleSignOut} variant="destructive" className="w-full sm:w-auto">
                {t("logout")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function AccountPage() {
  return <AuthGuard>{(session) => <AccountContent session={session} />}</AuthGuard>;
}
