import { useTranslations } from "next-intl";
import { Caveat } from "next/font/google";
import { PageContainer } from "@/components/PageContainer";

const caveat = Caveat({
  subsets: ["latin"],
});

export default function Home() {
  const t = useTranslations();

  return (
    <PageContainer className="bg-white" noPadding fullWidth>
      <div className="relative min-h-screen mx-auto"></div>
    </PageContainer>
  );
}
