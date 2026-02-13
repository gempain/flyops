"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import UserMenu from "@/components/UserMenu";
import BasketIcon from "@/components/BasketIcon";
import { useSession } from "@/lib/auth/client";
import { role } from "@/lib/auth/role";
import { Badge } from "@/components/ui/badge";
import { publicEnv } from "@/lib/env/public-env";

export default function Navigation() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === role.enum.admin;
  const navBgColor = isAdmin ? "bg-purple-50/95" : "bg-white/95";
  const showEnvName = publicEnv.NEXT_PUBLIC_SHOW_DEV_BANNER;

  const languages = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "fr", label: "FR", flag: "🇫🇷" },
    { code: "nl", label: "NL", flag: "🇳🇱" },
    { code: "de", label: "DE", flag: "🇩🇪" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed left-0 right-0 ${navBgColor} backdrop-blur-sm z-50 border-b border-gray-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-5 items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            {showEnvName ? (
              <div className="font-bold text-lg uppercase tracking-wide text-yellow-600">
                {publicEnv.NEXT_PUBLIC_ENVIRONMENT}
              </div>
            ) : (
              <Image src="/logo-noatec.svg" alt="NOATEC" width={96} height={48} className="h-12 w-auto" />
            )}
            {isAdmin && (
              <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
                Admin
              </Badge>
            )}
          </Link>

          <div className="flex items-center gap-3 md:hidden">
            <BasketIcon />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-5">
                <SheetHeader>
                  <SheetTitle>{t("navigation.menu")}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {!session ? (
                    <div className="flex flex-col gap-2 pb-4 border-b">
                      <Link href="/auth/login" onClick={closeMobileMenu}>
                        <button className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                          {t("auth.login")}
                        </button>
                      </Link>
                      <Link href="/auth/signup" onClick={closeMobileMenu}>
                        <button className="w-full px-4 py-2 text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors">
                          {t("auth.signup")}
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="pb-4 border-b">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{session.user.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{session.user.email}</div>
                      </div>
                      <Link
                        href="/auth/account"
                        className="block mt-3 text-sm text-gray-700 hover:text-gray-900"
                        onClick={closeMobileMenu}
                      >
                        {t("auth.myAccount")}
                      </Link>
                    </div>
                  )}

                  <Link
                    href="/"
                    className="text-gray-700 hover:text-gray-900 transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    {t("navigation.home")}
                  </Link>
                  <Link
                    href="/products"
                    className="text-gray-700 hover:text-gray-900 transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    {t("navigation.store")}
                  </Link>

                  <div className="border-t pt-4">
                    <div className="font-semibold text-sm text-gray-500 mb-2">{t("navigation.info")}</div>
                    <div className="flex flex-col gap-3 pl-3">
                      <Link
                        href="/articles"
                        className="text-gray-700 hover:text-gray-900 transition-colors py-1"
                        onClick={closeMobileMenu}
                      >
                        {t("navigation.articles")}
                      </Link>
                      <Link
                        href="/manual"
                        className="text-gray-700 hover:text-gray-900 transition-colors py-1"
                        onClick={closeMobileMenu}
                      >
                        {t("navigation.manual")}
                      </Link>
                      <Link
                        href="/how-to-use"
                        className="text-gray-700 hover:text-gray-900 transition-colors py-1"
                        onClick={closeMobileMenu}
                      >
                        {t("navigation.how-to-use")}
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/inprint"
                    className="text-gray-700 hover:text-gray-900 transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    {t("navigation.press")}
                  </Link>
                  <Link
                    href="/contact"
                    className="text-gray-700 hover:text-gray-900 transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    {t("navigation.contact")}
                  </Link>

                  <div className="border-t pt-4">
                    <div className="font-semibold text-sm text-gray-500 mb-2">{t("navigation.language")}</div>
                    <div className="flex flex-col gap-2 pl-3">
                      {languages.map((lang) => (
                        <Link
                          key={lang.code}
                          href="/"
                          locale={lang.code}
                          className="flex items-center gap-2 py-1 text-gray-700 hover:text-gray-900 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <span>{lang.flag}</span>
                          <span className="font-medium">{lang.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center space-x-5">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              {t("navigation.home")}
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors">
              {t("navigation.store")}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1">
                  {t("navigation.info")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/articles">{t("navigation.articles")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/manual">{t("navigation.manual")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/how-to-use">{t("navigation.how-to-use")}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/inprint" className="text-gray-700 hover:text-gray-900 transition-colors">
              {t("navigation.press")}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              {t("navigation.contact")}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  <span>{currentLanguage.flag}</span>
                  <span className="font-medium">{currentLanguage.label}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="right-0 left-auto w-40">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} asChild>
                    <Link href="/" locale={lang.code} className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <BasketIcon />

            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
