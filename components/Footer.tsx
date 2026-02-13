import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Legal Links */}
        <div className="text-center mb-8">
          <Link href="/legal/cgv" className="text-black underline hover:text-brand-green transition-colors">
            Conditions générales de vente
          </Link>
          {" - "}
          <Link href="/legal/cgu" className="text-black underline hover:text-brand-green transition-colors">
            Conditions générales d&apos;utilisation
          </Link>
          {" - "}
          <Link href="/legal/rgpd" className="text-black underline hover:text-brand-green transition-colors">
            Politique de confidentialité
          </Link>
        </div>

        <div className="flex justify-center mb-8">
          <Image
            src="/assets/2020/11/payment-method-logos-v3.jpg"
            alt="Payment methods"
            width={262}
            height={47}
            className="h-auto"
          />
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600">
          <p>Droit d&apos;auteur ©2019 NOA Technologies srl</p>
        </div>
      </div>
    </footer>
  );
}
