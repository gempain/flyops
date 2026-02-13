import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  const fullYear = new Date().getFullYear();
  return (
    <footer className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/legal/cgv" className="text-black underline hover:text-brand-green transition-colors">
            {t("cgv")}
          </Link>
          {" - "}
          <Link href="/legal/cgu" className="text-black underline hover:text-brand-green transition-colors">
            {t("cgu")}
          </Link>
          {" - "}
          <Link href="/legal/rgpd" className="text-black underline hover:text-brand-green transition-colors">
            {t("rgpd")}
          </Link>
        </div>

        <div className="text-center text-gray-600">
          <p>{t("copyright", { year: fullYear })}</p>
        </div>
      </div>
    </footer>
  );
}
