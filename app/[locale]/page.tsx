import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { Caveat } from "next/font/google";
import { PageContainer } from "@/components/PageContainer";

const caveat = Caveat({
  subsets: ["latin"],
});

export default function Home() {
  const t = useTranslations();

  return (
    <PageContainer className="bg-white" noPadding fullWidth>
      <div className="relative min-h-screen mx-auto">
        <NextImage
          src="/assets/2021/07/Noatec-GreenCushion-hp.jpg"
          alt="NOA Cushion"
          fill
          priority
          className="relative! w-auto! h-screen!"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 0,
            objectFit: "contain",
          }}
        />

        <div className="absolute top-16 md:top-48 right-0 z-10 flex items-start justify-end min-h-screen px-8 lg:px-32">
          <h1
            className={`text-2xl md:text-3xl font-bold text-brand-orange leading-tight max-w-2xl ${caveat.className}`}
            dangerouslySetInnerHTML={{ __html: t.raw("home.hero.title") }}
            style={{
              fontFamily: "Caveat, handwriting",
              fontSize: "clamp(32px, 5vw, 48px)",
              letterSpacing: "1px",
              lineHeight: "1.1em",
              textAlign: "left",
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
}
