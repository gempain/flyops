"use client";

import { signOut, useSession } from "@/lib/auth/client";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, Shield } from "lucide-react";
import { role } from "@/lib/auth/role";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserMenu() {
  const t = useTranslations("auth");
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isPending) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            {t("login")}
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm">{t("signup")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar>
          {session.user.image && <AvatarImage src={session.user.image} alt="Logo" />}
          <AvatarFallback>{session.user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium">{session.user.name}</div>
          <div className="text-xs text-gray-500">{session.user.email}</div>
        </div>
        {session.user.role === role.enum.admin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-semibold text-purple-600">{t("adminSection")}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/admin/orders" className="flex items-center cursor-pointer">
                <Shield className="w-4 h-4 mr-2" />
                {t("adminOrders")}
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-semibold text-blue-600">{t("accountSection")}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/auth/account" className="flex items-center cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            {t("accountSettings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="flex items-center cursor-pointer text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
