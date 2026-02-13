import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import NextImage from "next/image";
import ContentBlock from "@/components/ContentBlock";
import LearnMoreButton from "@/components/LearnMoreButton";
import FeatureBlock from "@/components/FeatureBlock";
import NewsletterForm from "@/components/NewsletterForm";
import { Caveat } from "next/font/google";
import { PageContainer } from "@/components/PageContainer";

const caveat = Caveat({
  subsets: ["latin"],
});

export default function Home() {
  const t = useTranslations();

  const videos = [
    {
      id: "kOOXklXUVJI",
      title: t("home.video1Title"),
    },
    {
      id: "8g5z02pyaeI",
      title: t("home.video2Title"),
    },
    {
      id: "7bf3Hpxgygw",
      title: t("home.video3Title"),
    },
  ];

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

      {/* Launch Section */}
      <section className="py-16 px-6 bg-brand-green text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">{t("home.launch.text")}</p>
          <p className="text-xl md:text-2xl text-white mb-8">{t("home.launch.subtext")}</p>
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-brand-orange text-white font-semibold text-xl rounded hover:bg-brand-green transition-all duration-300"
          >
            {t("home.launch.cta")}
          </Link>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Section */}
      <section className="py-32 px-6 bg-brand-green text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-24 h-1 bg-brand-orange mb-4 mx-auto"></div>
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">{t("home.whyNoa")}</p>
        </div>
      </section>

      {/* Background Image Section */}
      <section
        className="w-full bg-cover"
        style={{
          backgroundImage: "url(/assets/2019/12/dos-nu.jpg)",
          backgroundPosition: "center bottom",
          backgroundSize: "cover",
          height: "650px",
        }}
      ></section>

      {/* Problem Section */}
      <ContentBlock
        title={t("home.problem.title1")}
        subtitle={t("home.problem.title2")}
        imageUrl="/assets/2019/12/coussin-gros-plan-pt-format.jpg"
        imagePosition="left"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: t.raw("home.problem.description"),
          }}
        />
      </ContentBlock>

      {/* Solution Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-1 bg-brand-orange mb-8 mx-auto"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-8">{t("home.solution.title")}</h2>
          <div
            className="text-text-medium leading-relaxed text-justify"
            dangerouslySetInnerHTML={{
              __html: t.raw("home.solution.description"),
            }}
          />
        </div>
      </section>

      <section className="py-32 px-6 bg-brand-green text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-24 h-1 bg-brand-orange mb-4 mx-auto"></div>
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">{t("home.forWhom")}</p>
        </div>
      </section>

      {/* Content blocks */}
      <section className="w-full">
        <ContentBlock
          title={t("home.audience.children.title")}
          subtitle={t("home.problem.title2")}
          imageUrl="/assets/2019/12/jeune-fille.jpg"
          imagePosition="right"
        >
          <p
            dangerouslySetInnerHTML={{
              __html: t.raw("home.audience.children.content1"),
            }}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: t.raw("home.audience.children.content2"),
            }}
          />
          <p>
            <LearnMoreButton href="/articles/children">{t("home.learnMore")}</LearnMoreButton>
          </p>
        </ContentBlock>

        <ContentBlock title={t("home.audience.adults.title")} imageUrl="/assets/2019/12/homme.jpg" imagePosition="left">
          <p
            dangerouslySetInnerHTML={{
              __html: t.raw("home.audience.adults.content"),
            }}
          />
          <p>
            <LearnMoreButton href="/articles/adults">{t("home.learnMore")}</LearnMoreButton>
          </p>
        </ContentBlock>

        <ContentBlock
          title={t("home.audience.pregnant.title")}
          imageUrl="/assets/2019/12/femme-enceinte.jpg"
          imagePosition="right"
        >
          <p
            dangerouslySetInnerHTML={{
              __html: t.raw("home.audience.pregnant.content"),
            }}
          />
          <p>
            <LearnMoreButton href="/articles/pregnant-women">{t("home.learnMore")}</LearnMoreButton>
          </p>
        </ContentBlock>

        <ContentBlock
          title={t("home.audience.elderly.title")}
          imageUrl="/assets/2019/12/personne-mobilite-reduite.jpg"
          imagePosition="left"
        >
          <p
            dangerouslySetInnerHTML={{
              __html: t.raw("home.audience.elderly.content1"),
            }}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: t.raw("home.audience.elderly.content2"),
            }}
          />
          <p>
            <LearnMoreButton href="/articles/elderly">{t("home.learnMore")}</LearnMoreButton>
          </p>
        </ContentBlock>
      </section>

      {/* Solution Section */}
      <section className="py-32 px-6 bg-brand-green text-center">
        <div className="w-24 h-1 bg-brand-orange mb-4 inline-block"></div>
        <h2 className="text-3xl uppercase md:text-4xl font-bold text-white">{t("home.featuresTitle")}</h2>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            <FeatureBlock
              iconUrl="/assets/2019/12/picto-portable.svg"
              title={t("home.features.nomadic.title")}
              description={t.raw("home.features.nomadic.description")}
            />

            <FeatureBlock
              iconUrl="/assets/2019/12/picto-pliable.svg"
              title={t("home.features.foldable.title")}
              description={t.raw("home.features.foldable.description")}
            />

            <FeatureBlock
              iconUrl="/assets/2019/12/picto-leger.svg"
              title={t("home.features.lightweight.title")}
              description={t.raw("home.features.lightweight.description")}
            />

            <FeatureBlock
              iconUrl="/assets/2019/12/picto-valve.svg"
              title={t("home.features.selfInflating.title")}
              description={t.raw("home.features.selfInflating.description")}
            />

            <FeatureBlock
              iconUrl="/assets/2019/12/picto-sain.svg"
              title={t("home.features.healthy.title")}
              description={t.raw("home.features.healthy.description")}
            />

            <FeatureBlock
              iconUrl="/assets/2019/12/pictos-6-99-ans.svg"
              title={t("home.features.allAges.title")}
              description={t.raw("home.features.allAges.description")}
            />
          </div>
        </div>
      </section>

      <section
        className="w-full bg-cover bg-center"
        style={{
          backgroundImage: "url(/assets/2019/12/photo-bg-dos-femme.jpg)",
          height: "530px",
        }}
      ></section>

      {/* Conclusion Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-md mx-auto text-center">
          <div
            className="text-text-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.raw("home.conclusion.text") }}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-1 bg-brand-orange mx-auto mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-8">{t("home.contact.title")}</h2>
          <div
            className="text-text-medium leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: t.raw("home.contact.description"),
            }}
          />
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-16 px-6 bg-brand-green text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">{t("home.companyInfo.title")}</h3>
          <p className="mb-2">{t("home.companyInfo.companyName")}</p>
          <p className="mb-2">{t("home.companyInfo.address")}</p>
          <p className="mb-8">{t("home.companyInfo.registration")}</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.facebook.com/noatechnologies/"
              className="inline-block px-6 py-3 bg-white text-brand-green font-semibold rounded hover:bg-brand-orange hover:text-white transition-all duration-300"
              title={t("home.companyInfo.followFacebook")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://www.linkedin.com/company/noatechnologies/about/"
              className="inline-block px-6 py-3 bg-white text-brand-green font-semibold rounded hover:bg-brand-orange hover:text-white transition-all duration-300"
              title={t("home.companyInfo.followLinkedIn")}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          <NewsletterForm />
        </div>
      </section>
    </PageContainer>
  );
}
