import { useSession } from "@/lib/auth/client";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { role as roleEnum } from "@/lib/auth/role";
import { PageContainer } from "@/components/PageContainer";

export type Session = NonNullable<ReturnType<typeof useSession>["data"]>;

interface AuthGuardProps {
  children: React.ReactNode | ((session: Session) => React.ReactNode);
  requiredRole?: "admin" | "user";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const t = useTranslations("auth");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <PageContainer className="flex items-center justify-center bg-gray-50">
        <LoadingState size="lg" message={t("loading")} />
      </PageContainer>
    );
  }

  if (!session) {
    return null;
  }

  if (requiredRole === "admin" && session.user.role !== roleEnum.enum.admin) {
    return (
      <PageContainer className="flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">{t("accessDenied")}</CardTitle>
            <CardDescription>{t("accessDeniedDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-gray-600 text-center">{t("adminAccessRequired")}</p>
            <Button onClick={() => router.push("/")} className="w-full">
              {t("backToHome")}
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return <>{typeof children === "function" ? children(session) : children}</>;
}
