import { useLocale } from "next-intl";
import { PageContainer } from "@/components/PageContainer";

const CGUContent = {
  fr: {
    title: "Conditions générales d'utilisation",
    content: (
      <>
        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Article 1 – Définitions</h4>
        <p>On désignera par la suite :</p>
        <p>
          – 'Site' : le site{" "}
          <a href="https://noatec.eu" target="_blank" rel="noopener noreferrer" className="text-brand-green underline">
            https://noatec.eu
          </a>{" "}
          et l'ensemble de ses pages.
          <br />
          – 'Editeur' : la personne morale responsable de l'édition et du contenu du site, et présentée dans les
          mentions légales du site.
          <br />– 'Utilisateur' : l'internaute visitant et utilisant le site.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Article 2 – Objet du site</h4>
        <p>
          Le présent site est édité par NOA Technologies srl (ou NOATEC). L'objet du présent site est déterminé comme «
          site de vente en ligne ». Le site est d'accès libre et gratuit à tout internaute.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Article 3 – Propriété intellectuelle</h4>
        <p>
          Tous les éléments du présent site appartiennent à l'éditeur ou à un tiers mandataire. Toute copie des logos,
          contenus textuels, pictographiques ou vidéos est rigoureusement interdite et s'apparente à de la contrefaçon.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Article 4 – Limitation de responsabilité</h4>
        <p>
          L'éditeur du site n'est tenu que par une obligation de moyens ; sa responsabilité ne pourra être engagée pour
          un dommage résultant de l'utilisation du réseau Internet tel que perte de données, intrusion, virus, rupture
          du service, ou autres.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Article 5 – Utilisation de Cookies</h4>
        <p>
          Un « Cookie » permet l'identification de l'utilisateur d'un site. Le site est susceptible d'utiliser des «
          Cookies » principalement pour obtenir des statistiques de navigation afin d'améliorer l'expérience de
          l'Utilisateur.
        </p>
        <p>Tous droits réservés – 21 décembre 2019</p>
      </>
    ),
  },
  en: {
    title: "Terms of Use",
    content: (
      <>
        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Article 1 – Definitions</h4>
        <p>The following terms are designated as:</p>
        <p>
          – 'Site': the website{" "}
          <a href="https://noatec.eu" target="_blank" rel="noopener noreferrer" className="text-brand-green underline">
            https://noatec.eu
          </a>{" "}
          and all of its pages.
          <br />
          – 'Publisher': the legal entity responsible for publishing and content of the site, presented in the legal
          notices.
          <br />– 'User': the internet user visiting and using the site.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Article 2 – Purpose of the site</h4>
        <p>
          This site is published by NOA Technologies srl (or NOATEC). The purpose of this site is defined as "online
          sales site". The site is freely and openly accessible to all internet users.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Article 3 – Intellectual property</h4>
        <p>
          All elements of this site belong to the publisher or a third party agent. Any copying of logos, textual,
          pictographic or video content is strictly prohibited and constitutes counterfeiting.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Article 4 – Limitation of liability</h4>
        <p>
          The site publisher is only bound by an obligation of means; their liability cannot be engaged for damage
          resulting from use of the Internet network such as data loss, intrusion, virus, service interruption, or
          others.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Article 5 – Use of Cookies</h4>
        <p>
          A "Cookie" allows identification of a site user. The site may use "Cookies" primarily to obtain navigation
          statistics to improve the User experience.
        </p>
        <p>All rights reserved – December 21, 2019</p>
      </>
    ),
  },
  de: {
    title: "Allgemeine Nutzungsbedingungen",
    content: (
      <>
        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Artikel 1 – Definitionen</h4>
        <p>Im Folgenden werden bezeichnet:</p>
        <p>
          – 'Website': die Website{" "}
          <a href="https://noatec.eu" target="_blank" rel="noopener noreferrer" className="text-brand-green underline">
            https://noatec.eu
          </a>{" "}
          und alle ihre Seiten.
          <br />
          – 'Herausgeber': die juristische Person, die für die Veröffentlichung und den Inhalt der Website
          verantwortlich ist und im Impressum präsentiert wird.
          <br />– 'Benutzer': der Internetnutzer, der die Website besucht und nutzt.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Artikel 2 – Zweck der Website</h4>
        <p>
          Diese Website wird von NOA Technologies srl (oder NOATEC) herausgegeben. Der Zweck dieser Website wird als
          "Online-Verkaufsseite" definiert. Die Website ist für alle Internetnutzer frei und offen zugänglich.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Artikel 3 – Geistiges Eigentum</h4>
        <p>
          Alle Elemente dieser Website gehören dem Herausgeber oder einem Drittanbieter. Jegliches Kopieren von Logos,
          Text-, Bild- oder Videoinhalten ist strengstens untersagt und stellt eine Fälschung dar.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Artikel 4 – Haftungsbeschränkung</h4>
        <p>
          Der Website-Herausgeber ist nur zu einer Verpflichtung zur Mittelverwendung verpflichtet; seine Haftung kann
          nicht für Schäden geltend gemacht werden, die sich aus der Nutzung des Internetnetzwerks ergeben, wie
          Datenverlust, Eindringen, Viren, Dienstunterbrechung oder andere.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Artikel 5 – Verwendung von Cookies</h4>
        <p>
          Ein "Cookie" ermöglicht die Identifizierung eines Website-Benutzers. Die Website kann "Cookies" hauptsächlich
          verwenden, um Navigationsstatistiken zu erhalten, um die Benutzererfahrung zu verbessern.
        </p>
        <p>Alle Rechte vorbehalten – 21. Dezember 2019</p>
      </>
    ),
  },
  nl: {
    title: "Algemene gebruiksvoorwaarden",
    content: (
      <>
        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Artikel 1 – Definities</h4>
        <p>De volgende termen worden aangeduid als:</p>
        <p>
          – 'Site': de website{" "}
          <a href="https://noatec.eu" target="_blank" rel="noopener noreferrer" className="text-brand-green underline">
            https://noatec.eu
          </a>{" "}
          en al haar pagina's.
          <br />
          – 'Uitgever': de rechtspersoon verantwoordelijk voor de publicatie en inhoud van de site, gepresenteerd in de
          wettelijke kennisgevingen.
          <br />– 'Gebruiker': de internetgebruiker die de site bezoekt en gebruikt.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Artikel 2 – Doel van de site</h4>
        <p>
          Deze site wordt gepubliceerd door NOA Technologies srl (of NOATEC). Het doel van deze site wordt gedefinieerd
          als "online verkoopsite". De site is vrij en openlijk toegankelijk voor alle internetgebruikers.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Artikel 3 – Intellectueel eigendom</h4>
        <p>
          Alle elementen van deze site behoren toe aan de uitgever of een derde partij agent. Elk kopiëren van logo's,
          tekstuele, pictografische of video-inhoud is strikt verboden en vormt namaak.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Artikel 4 – Beperking van aansprakelijkheid</h4>
        <p>
          De site-uitgever is alleen gebonden door een middelenverplichting; hun aansprakelijkheid kan niet worden
          ingeroepen voor schade die voortvloeit uit het gebruik van het internetnetwerk zoals gegevensverlies, inbraak,
          virus, onderbreking van de dienst, of andere.
        </p>

        <h4 className="text-xl font-bold text-text-dark mt-8 mb-4">Artikel 5 – Gebruik van Cookies</h4>
        <p>
          Een "Cookie" maakt identificatie van een sitegebruiker mogelijk. De site kan "Cookies" gebruiken, voornamelijk
          om navigatiestatistieken te verkrijgen om de gebruikerservaring te verbeteren.
        </p>
        <p>Alle rechten voorbehouden – 21 december 2019</p>
      </>
    ),
  },
};

export default function CGU() {
  const locale = useLocale() as "fr" | "en" | "de" | "nl";
  const content = CGUContent[locale] || CGUContent.fr;

  return (
    <PageContainer className="bg-white" noPadding fullWidth>
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20 lg:py-24">
        <div className="w-24 h-1 bg-brand-orange mb-8"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-8 text-center">{content.title}</h1>

        <div className="prose prose-lg max-w-none text-justify leading-relaxed">{content.content}</div>
      </div>
    </PageContainer>
  );
}
