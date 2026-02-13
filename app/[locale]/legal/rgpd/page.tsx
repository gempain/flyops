import { useLocale } from "next-intl";
import { PageContainer } from "@/components/PageContainer";

const RGPDContent = {
  fr: {
    title: "Politique de confidentialité",
    content: (
      <>
        <p className="font-bold">Définition des termes utilisés dans la politique de confidentialité</p>
        <p>
          On désignera par la suite :<br />
          • « Donnée personnelle » : toute information relative à une personne physique identifiée ou identifiable.
          <br />• « Service » : le service{" "}
          <a href="https://noatec.eu" target="_blank" rel="noopener noreferrer" className="text-brand-green underline">
            https://noatec.eu
          </a>{" "}
          et l'ensemble de ses contenus.
          <br />
          • « Editeur » ou « Nous » : la société NOA Technologies srl (ou NOATEC).
          <br />• « Utilisateur » ou « Vous » : l'internaute visitant et utilisant le Service.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 1 – Introduction</h4>
        <p>
          La présente charte vise à vous informer des engagements du Service eu égard au respect de votre vie privée et
          à la protection des données personnelles vous concernant. Si vous avez des questions, veuillez nous contacter
          par e-mail à : info@noatec.eu ou par courrier à : NOA Technologies srl, rue Arsène Grosjean, 6 à 5020
          Temploux.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 2 – Données collectées</h4>
        <p>
          Les Données collectées sont celles que vous nous transmettez volontairement. Votre adresse IP est collectée
          automatiquement. Nous ne collectons pas de données sensibles.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 3 – Responsable du traitement</h4>
        <p>Le responsable du traitement est NOA Technologies srl, rue Arsène Grosjean, 6 à 5020 Temploux, Belgique.</p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 4 – Vos droits</h4>
        <p>
          Conformément au RGPD, vous disposez des droits suivants :<br />
          • Droit d'accès
          <br />
          • Droit de rectification
          <br />
          • Droit à l'effacement
          <br />
          • Droit à la limitation du traitement
          <br />
          • Droit à la portabilité des données
          <br />• Droit d'opposition
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 5 – Cookies</h4>
        <p>
          Le site utilise des cookies pour améliorer l'expérience utilisateur et obtenir des statistiques de navigation.
          Vous pouvez configurer votre navigateur pour refuser les cookies.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 6 – Contact</h4>
        <p>Pour toute question concernant cette politique de confidentialité, contactez-nous à info@noatec.eu</p>

        <p>Tous droits réservés – 25 décembre 2019</p>
      </>
    ),
  },
  en: {
    title: "Privacy Policy",
    content: (
      <>
        <p className="font-bold">Definition of terms used in the privacy policy</p>
        <p>
          The following terms are designated as:
          <br />
          • "Personal Data": any information relating to an identified or identifiable natural person.
          <br />• "Service": the service{" "}
          <a href="https://noatec.eu" target="_blank" rel="noopener noreferrer" className="text-brand-green underline">
            https://noatec.eu
          </a>{" "}
          and all of its content.
          <br />
          • "Publisher" or "We": the company NOA Technologies srl (or NOATEC).
          <br />• "User" or "You": the internet user visiting and using the Service.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 1 – Introduction</h4>
        <p>
          This charter aims to inform you of the Service's commitments regarding respect for your privacy and protection
          of your personal data. If you have any questions, please contact us by email at: info@noatec.eu or by mail at:
          NOA Technologies srl, rue Arsène Grosjean, 6 at 5020 Temploux.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 2 – Data collected</h4>
        <p>
          The Data collected is what you voluntarily transmit to us. Your IP address is collected automatically. We do
          not collect sensitive data.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 3 – Data controller</h4>
        <p>The data controller is NOA Technologies srl, rue Arsène Grosjean, 6 at 5020 Temploux, Belgium.</p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 4 – Your rights</h4>
        <p>
          In accordance with GDPR, you have the following rights:
          <br />
          • Right of access
          <br />
          • Right to rectification
          <br />
          • Right to erasure
          <br />
          • Right to restriction of processing
          <br />
          • Right to data portability
          <br />• Right to object
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 5 – Cookies</h4>
        <p>
          The site uses cookies to improve user experience and obtain navigation statistics. You can configure your
          browser to refuse cookies.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Article 6 – Contact</h4>
        <p>For any questions regarding this privacy policy, contact us at info@noatec.eu</p>

        <p>All rights reserved – December 25, 2019</p>
      </>
    ),
  },
  de: {
    title: "Datenschutzrichtlinie",
    content: (
      <>
        <p className="font-bold">Definition der in der Datenschutzrichtlinie verwendeten Begriffe</p>
        <p>
          Die folgenden Begriffe werden bezeichnet als:
          <br />
          • "Personenbezogene Daten": alle Informationen, die sich auf eine identifizierte oder identifizierbare
          natürliche Person beziehen.
          <br />• "Dienst": der Dienst{" "}
          <a href="https://noatec.eu" target="_blank" rel="noopener noreferrer" className="text-brand-green underline">
            https://noatec.eu
          </a>{" "}
          und alle seine Inhalte.
          <br />
          • "Herausgeber" oder "Wir": das Unternehmen NOA Technologies srl (oder NOATEC).
          <br />• "Benutzer" oder "Sie": der Internetnutzer, der den Dienst besucht und nutzt.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 1 – Einführung</h4>
        <p>
          Diese Charta zielt darauf ab, Sie über die Verpflichtungen des Dienstes in Bezug auf die Achtung Ihrer
          Privatsphäre und den Schutz Ihrer personenbezogenen Daten zu informieren. Bei Fragen kontaktieren Sie uns
          bitte per E-Mail an: info@noatec.eu oder per Post an: NOA Technologies srl, rue Arsène Grosjean, 6 in 5020
          Temploux.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 2 – Gesammelte Daten</h4>
        <p>
          Die gesammelten Daten sind die, die Sie uns freiwillig übermitteln. Ihre IP-Adresse wird automatisch erfasst.
          Wir sammeln keine sensiblen Daten.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">
          Artikel 3 – Verantwortlicher für die Verarbeitung
        </h4>
        <p>
          Der Verantwortliche für die Verarbeitung ist NOA Technologies srl, rue Arsène Grosjean, 6 in 5020 Temploux,
          Belgien.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 4 – Ihre Rechte</h4>
        <p>
          Gemäß DSGVO haben Sie folgende Rechte:
          <br />
          • Auskunftsrecht
          <br />
          • Recht auf Berichtigung
          <br />
          • Recht auf Löschung
          <br />
          • Recht auf Einschränkung der Verarbeitung
          <br />
          • Recht auf Datenübertragbarkeit
          <br />• Widerspruchsrecht
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 5 – Cookies</h4>
        <p>
          Die Website verwendet Cookies, um die Benutzererfahrung zu verbessern und Navigationsstatistiken zu erhalten.
          Sie können Ihren Browser so konfigurieren, dass Cookies abgelehnt werden.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 6 – Kontakt</h4>
        <p>Bei Fragen zu dieser Datenschutzrichtlinie kontaktieren Sie uns unter info@noatec.eu</p>

        <p>Alle Rechte vorbehalten – 25. Dezember 2019</p>
      </>
    ),
  },
  nl: {
    title: "Privacybeleid",
    content: (
      <>
        <p className="font-bold">Definitie van termen gebruikt in het privacybeleid</p>
        <p>
          De volgende termen worden aangeduid als:
          <br />
          • "Persoonlijke Gegevens": alle informatie met betrekking tot een geïdentificeerde of identificeerbare
          natuurlijke persoon.
          <br />• "Dienst": de dienst{" "}
          <a href="https://noatec.eu" target="_blank" rel="noopener noreferrer" className="text-brand-green underline">
            https://noatec.eu
          </a>{" "}
          en al zijn inhoud.
          <br />
          • "Uitgever" of "Wij": het bedrijf NOA Technologies srl (of NOATEC).
          <br />• "Gebruiker" of "U": de internetgebruiker die de Dienst bezoekt en gebruikt.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 1 – Introductie</h4>
        <p>
          Dit charter is bedoeld om u te informeren over de verplichtingen van de Dienst met betrekking tot respect voor
          uw privacy en bescherming van uw persoonlijke gegevens. Als u vragen heeft, neem dan contact met ons op via
          e-mail: info@noatec.eu of per post: NOA Technologies srl, rue Arsène Grosjean, 6 te 5020 Temploux.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 2 – Verzamelde gegevens</h4>
        <p>
          De verzamelde gegevens zijn wat u vrijwillig aan ons doorgeeft. Uw IP-adres wordt automatisch verzameld. We
          verzamelen geen gevoelige gegevens.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 3 – Verantwoordelijke voor de verwerking</h4>
        <p>
          De verantwoordelijke voor de verwerking is NOA Technologies srl, rue Arsène Grosjean, 6 te 5020 Temploux,
          België.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 4 – Uw rechten</h4>
        <p>
          In overeenstemming met de AVG heeft u de volgende rechten:
          <br />
          • Recht op toegang
          <br />
          • Recht op rectificatie
          <br />
          • Recht op wissing
          <br />
          • Recht op beperking van de verwerking
          <br />
          • Recht op gegevensoverdraagbaarheid
          <br />• Recht van bezwaar
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 5 – Cookies</h4>
        <p>
          De site gebruikt cookies om de gebruikerservaring te verbeteren en navigatiestatistieken te verkrijgen. U kunt
          uw browser configureren om cookies te weigeren.
        </p>

        <h4 className="text-xl font-bold text-[#3a3a3a] mt-8 mb-4">Artikel 6 – Contact</h4>
        <p>Voor vragen over dit privacybeleid, neem contact met ons op via info@noatec.eu</p>

        <p>Alle rechten voorbehouden – 25 december 2019</p>
      </>
    ),
  },
};

export default function RGPD() {
  const locale = useLocale() as "fr" | "en" | "de" | "nl";
  const content = RGPDContent[locale] || RGPDContent.fr;

  return (
    <PageContainer className="bg-white" noPadding fullWidth>
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20 lg:py-24">
        <div className="w-24 h-1 bg-brand-orange mb-8"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#3a3a3a] mb-8 text-center">{content.title}</h1>

        <div className="prose prose-lg max-w-none text-justify leading-relaxed">{content.content}</div>
      </div>
    </PageContainer>
  );
}
