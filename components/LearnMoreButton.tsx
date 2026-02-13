import { Link } from "@/i18n/routing";

type LearnMoreButtonProps = {
  href: string;
  children: React.ReactNode;
};

export default function LearnMoreButton({ href, children }: LearnMoreButtonProps) {
  return (
    <Link
      href={href}
      className="text-brand-green inline-block px-6 py-3 bg-bg-light font-semibold hover:bg-brand-green hover:text-white transition-all duration-300"
    >
      {children}
    </Link>
  );
}
