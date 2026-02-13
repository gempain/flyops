import { useLocale } from "next-intl";
import { PageContainer } from "@/components/PageContainer";

const CGVContent = {
  fr: {
    title: "Conditions générales de vente",
    content: (
      <>
        <p>&nbsp;</p>
        <p>
          NOA Technologies srl (en abrégé NOATEC, 6 rue Arsène Grosjean à 5020 Temploux, Belgique, BCE&nbsp;: 0728 877
          103, TVA&nbsp;: BE0728 877 103, info@noatec.eu) crée et commercialise des produits de bien-être paramédicaux.
          <br />
          Les conditions particulières et les présentes conditions générales de vente constituent le cadre contractuel.
          Les conditions générales s&apos;appliquent à toute commande de ces produits passée par le client.
        </p>
        <p>
          Elles sont à la disposition et acceptées par le client qui reconnait qu&apos;elles sont applicables à toutes
          les transactions conclues avec NOATEC.
          <br />
          Les éventuelles conditions générales de l&apos;acheteur seront considérées comme nulles et sans valeur, même
          si celles-ci affirment le contraire.
        </p>

        <p>
          <strong>Responsabilités</strong>
          <br />
          Le client déclare être capable juridiquement et avoir au moins 18 ans le jour de la passation de la commande.
          <br />
          Il s&apos;engage à fournir des informations qui soient exactes, précises et à jour. Il se déclare être
          titulaire de la carte bancaire avec laquelle/lequel il sera procédé au paiement de produits commandés ou
          confirme avoir l&apos;autorisation en bonne et due forme du titulaire.
        </p>

        <p>
          <strong>Commande</strong>
          <br />
          Sauf stipulation contraire, les offres et remises de prix sont valables 30 jours.
          <br />
          Le client valide sa commande par courrier, par e-mail ou en ligne après avoir accepté les présentes conditions
          de vente. Le client est tenu de vérifier chacun des éléments de sa commande avant de la confirmer. Lorsque le
          client clique sur une icône dont le libellé engendre un engagement que tout internaute comprendrait, il est
          lié par ce clic. Tel est par exemple le cas des icônes «&nbsp;Validation&nbsp;», «&nbsp;Paiement&nbsp;» ou
          tout autre intitulé similaire.
        </p>

        <p>
          Noatec se réserve de ne pas valider/exécuter la commande notamment dans les hypothèses suivantes:
          <br />
          en cas de produits non disponibles en stock. Noatec n&apos;offre à la vente sur son site que les produits qui
          sont disponibles en stock. Les offres de services et prix sont valables tant qu&apos;ils sont visibles sur le
          site. Pour autant, en cas de commande d&apos;un produit qui, pour quelque raison que ce soit, n&apos;est plus
          disponible en stock, Noatec vous en informera et annulera la commande pour le produit non disponible en stock
          ;<br />
          En cas de refus de validation du paiement par l&apos;émetteur de la carte de paiement que le client utilise,
          ou en cas de fraude ou de soupçon raisonnable de fraude ;<br />
          En cas de commande d&apos;un volume important d&apos;un même produit ou à destination d&apos;une même adresse
          de livraison ;<br />
          Dans une telle hypothèse, les sommes, le cas échéant, que le client a versées lui seront intégralement
          remboursées dans les plus brefs délais, la commande sera annulée et le contrat d&apos;achat n&apos;est pas
          réputé conclu.
        </p>

        <p>
          <strong>Prix</strong>
          <br />
          Les prix affichés sont affichés en EURO, toutes taxes comprises. Les frais de port sont en supplément. Le
          montant de la TVA est de 21% et les frais de port apparaissent sur l&apos;écran à la fin de la sélection des
          différents produits par le client. Le paiement du prix est dû à la conclusion du contrat.
        </p>

        <p>
          <strong>Livraison</strong>
          <br />
          Les délais de livraison prévus sur le bon de commande, devis ou sur le site ne sont donnés qu&apos;à titre
          indicatif et ne sont pas de rigueur. Le client ne pourra en aucun cas invoquer la non observation des délais
          fixés pour réclamer des dommages et intérêts ou la résiliation de la vente sauf à prouver la faute lourde dans
          le chef de NOATEC.
        </p>

        <p>
          <strong>Garantie</strong>
          <br />
          Le coussin est garanti un an à compter de la date d&apos;achat. Ce bien de consommation a comme
          caractéristiques une durée de vie et une usure auxquelles le consommateur peut raisonnablement s&apos;attendre
          vu la nature du produit. Il devra être utilisé selon les indications fournies dans la boîte.
        </p>

        <p>
          <strong>Droit de rétractation / Retours</strong>
          <br />
          Le client consommateur a le droit de se rétracter de sa commande, sans avoir à donner de motifs, dans un délai
          de quinze (15) jours calendaires, à compter du jour où le client, ou un tiers désigné par le client autre que
          le transporteur, prend physiquement possession du produit.
        </p>

        <p>
          NOA Technologies srl
          <br />
          Rue Arsène Grosjean, 6 – 5020 Temploux
          <br />
          info@noatec.eu
        </p>
        <p>N° de TVA intra-communautaire&nbsp;: BE0728 877 103 – N° BCE&nbsp;: 0728 877 103</p>
      </>
    ),
    downloadButton: "Télécharger le formulaire de rétractation",
  },
  en: {
    title: "Terms and Conditions of Sale",
    content: (
      <>
        <p>&nbsp;</p>
        <p>
          NOA Technologies srl (abbreviated as NOATEC, 6 rue Arsène Grosjean at 5020 Temploux, Belgium, BCE: 0728 877
          103, VAT: BE0728 877 103, info@noatec.eu) creates and markets paramedical wellness products.
          <br />
          The specific conditions and these general conditions of sale constitute the contractual framework. The general
          conditions apply to any order for these products placed by the customer.
        </p>
        <p>
          They are available and accepted by the customer who acknowledges that they apply to all transactions concluded
          with NOATEC.
          <br />
          Any general conditions of the purchaser will be considered null and void, even if they state otherwise.
        </p>

        <p>
          <strong>Responsibilities</strong>
          <br />
          The customer declares to be legally capable and to be at least 18 years old on the day of placing the order.
          <br />
          They undertake to provide information that is accurate, precise and up to date. They declare to be the holder
          of the bank card with which payment for ordered products will be made or confirm having proper authorization
          from the holder.
        </p>

        <p>
          <strong>Order</strong>
          <br />
          Unless otherwise stated, offers and price discounts are valid for 30 days.
          <br />
          The customer validates their order by mail, email or online after accepting these terms of sale. The customer
          is required to check each element of their order before confirming it.
        </p>

        <p>
          <strong>Price</strong>
          <br />
          Displayed prices are shown in EURO, all taxes included. Shipping costs are additional. The VAT rate is 21% and
          shipping costs appear on screen at the end of product selection by the customer. Payment of the price is due
          upon conclusion of the contract.
        </p>

        <p>
          <strong>Delivery</strong>
          <br />
          Delivery times indicated on the order form, quote or website are given for information only and are not
          binding. The customer may not under any circumstances invoke non-compliance with set deadlines to claim
          damages or cancellation of the sale except by proving gross negligence on NOATEC's part.
        </p>

        <p>
          <strong>Warranty</strong>
          <br />
          The cushion is guaranteed for one year from the date of purchase. This consumer good has characteristics of
          lifespan and wear that the consumer can reasonably expect given the nature of the product. It must be used
          according to the instructions provided in the box.
        </p>

        <p>
          <strong>Right of withdrawal / Returns</strong>
          <br />
          The consumer customer has the right to withdraw from their order, without having to give reasons, within
          fifteen (15) calendar days from the day the customer, or a third party designated by the customer other than
          the carrier, takes physical possession of the product.
        </p>

        <p>
          NOA Technologies srl
          <br />
          Rue Arsène Grosjean, 6 – 5020 Temploux
          <br />
          info@noatec.eu
        </p>
        <p>Intra-community VAT No.: BE0728 877 103 – BCE No.: 0728 877 103</p>
      </>
    ),
    downloadButton: "Download the withdrawal form",
  },
  de: {
    title: "Allgemeine Geschäftsbedingungen",
    content: (
      <>
        <p>&nbsp;</p>
        <p>
          NOA Technologies srl (abgekürzt NOATEC, 6 rue Arsène Grosjean in 5020 Temploux, Belgien, BCE: 0728 877 103,
          MwSt.: BE0728 877 103, info@noatec.eu) entwickelt und vertreibt paramedizinische Wellnessprodukte.
          <br />
          Die besonderen Bedingungen und diese allgemeinen Verkaufsbedingungen bilden den Vertragsrahmen. Die
          allgemeinen Bedingungen gelten für jede Bestellung dieser Produkte durch den Kunden.
        </p>
        <p>
          Sie stehen zur Verfügung und werden vom Kunden akzeptiert, der anerkennt, dass sie für alle mit NOATEC
          abgeschlossenen Transaktionen gelten.
          <br />
          Etwaige allgemeine Bedingungen des Käufers werden als null und nichtig betrachtet, auch wenn diese das
          Gegenteil behaupten.
        </p>

        <p>
          <strong>Verantwortlichkeiten</strong>
          <br />
          Der Kunde erklärt, rechtlich geschäftsfähig zu sein und am Tag der Bestellung mindestens 18 Jahre alt zu sein.
          <br />
          Er verpflichtet sich, genaue, präzise und aktuelle Informationen bereitzustellen. Er erklärt, Inhaber der
          Bankkarte zu sein, mit der die Zahlung für bestellte Produkte erfolgt, oder bestätigt, die ordnungsgemäße
          Genehmigung des Inhabers zu haben.
        </p>

        <p>
          <strong>Bestellung</strong>
          <br />
          Sofern nicht anders angegeben, sind Angebote und Preisnachlässe 30 Tage gültig.
          <br />
          Der Kunde bestätigt seine Bestellung per Post, E-Mail oder online nach Annahme dieser Verkaufsbedingungen. Der
          Kunde ist verpflichtet, jedes Element seiner Bestellung vor der Bestätigung zu überprüfen.
        </p>

        <p>
          <strong>Preis</strong>
          <br />
          Die angezeigten Preise werden in EURO angezeigt, alle Steuern inbegriffen. Versandkosten kommen hinzu. Der
          MwSt-Satz beträgt 21% und die Versandkosten erscheinen am Ende der Produktauswahl durch den Kunden auf dem
          Bildschirm. Die Zahlung des Preises ist bei Vertragsabschluss fällig.
        </p>

        <p>
          <strong>Lieferung</strong>
          <br />
          Die auf dem Bestellformular, Angebot oder der Website angegebenen Lieferzeiten sind nur Richtwerte und nicht
          verbindlich. Der Kunde kann unter keinen Umständen die Nichteinhaltung festgelegter Fristen geltend machen, um
          Schadensersatz oder Stornierung des Verkaufs zu fordern, außer durch Nachweis grober Fahrlässigkeit seitens
          NOATEC.
        </p>

        <p>
          <strong>Garantie</strong>
          <br />
          Das Kissen hat ab Kaufdatum eine einjährige Garantie. Dieses Verbrauchsgut hat Eigenschaften der Lebensdauer
          und Abnutzung, die der Verbraucher angesichts der Art des Produkts vernünftigerweise erwarten kann. Es muss
          gemäß den in der Box bereitgestellten Anweisungen verwendet werden.
        </p>

        <p>
          <strong>Widerrufsrecht / Rücksendungen</strong>
          <br />
          Der Verbraucherkunde hat das Recht, seine Bestellung ohne Angabe von Gründen innerhalb von fünfzehn (15)
          Kalendertagen ab dem Tag zu widerrufen, an dem der Kunde oder ein vom Kunden benannter Dritter, der nicht der
          Beförderer ist, physisch Besitz des Produkts ergreift.
        </p>

        <p>
          NOA Technologies srl
          <br />
          Rue Arsène Grosjean, 6 – 5020 Temploux
          <br />
          info@noatec.eu
        </p>
        <p>Innergemeinschaftliche MwSt-Nr.: BE0728 877 103 – BCE-Nr.: 0728 877 103</p>
      </>
    ),
    downloadButton: "Widerrufsformular herunterladen",
  },
  nl: {
    title: "Algemene verkoopvoorwaarden",
    content: (
      <>
        <p>&nbsp;</p>
        <p>
          NOA Technologies srl (afgekort NOATEC, 6 rue Arsène Grosjean te 5020 Temploux, België, BCE: 0728 877 103, BTW:
          BE0728 877 103, info@noatec.eu) creëert en verkoopt paramedische wellnessproducten.
          <br />
          De specifieke voorwaarden en deze algemene verkoopvoorwaarden vormen het contractuele kader. De algemene
          voorwaarden zijn van toepassing op elke bestelling van deze producten door de klant.
        </p>
        <p>
          Ze zijn beschikbaar en geaccepteerd door de klant die erkent dat ze van toepassing zijn op alle transacties
          die met NOATEC zijn afgesloten.
          <br />
          Eventuele algemene voorwaarden van de koper worden als nietig en van nul en generlei waarde beschouwd, zelfs
          als deze het tegendeel beweren.
        </p>

        <p>
          <strong>Verantwoordelijkheden</strong>
          <br />
          De klant verklaart wettelijk bevoegd te zijn en minstens 18 jaar oud te zijn op de dag van het plaatsen van de
          bestelling.
          <br />
          Hij verbindt zich ertoe nauwkeurige, precieze en actuele informatie te verstrekken. Hij verklaart houder te
          zijn van de bankkaart waarmee betaling voor bestelde producten zal plaatsvinden of bevestigt de juiste
          autorisatie van de houder te hebben.
        </p>

        <p>
          <strong>Bestelling</strong>
          <br />
          Tenzij anders vermeld, zijn aanbiedingen en prijskortingen 30 dagen geldig.
          <br />
          De klant valideert zijn bestelling per post, e-mail of online na het accepteren van deze verkoopvoorwaarden.
          De klant is verplicht elk element van zijn bestelling te controleren alvorens deze te bevestigen.
        </p>

        <p>
          <strong>Prijs</strong>
          <br />
          Weergegeven prijzen worden getoond in EURO, alle belastingen inbegrepen. Verzendkosten komen daarbij. Het
          BTW-tarief bedraagt 21% en de verzendkosten verschijnen op het scherm aan het einde van de productselectie
          door de klant. Betaling van de prijs is verschuldigd bij het afsluiten van het contract.
        </p>

        <p>
          <strong>Levering</strong>
          <br />
          Leveringstijden aangegeven op het bestelformulier, offerte of website zijn enkel ter informatie en niet
          bindend. De klant kan in geen geval het niet naleven van gestelde deadlines inroepen om schadevergoeding of
          annulering van de verkoop te eisen, behalve door grove nalatigheid van NOATEC aan te tonen.
        </p>

        <p>
          <strong>Garantie</strong>
          <br />
          Het kussen heeft een garantie van één jaar vanaf de aankoopdatum. Dit consumptiegoed heeft kenmerken van
          levensduur en slijtage die de consument redelijkerwijs kan verwachten gezien de aard van het product. Het moet
          worden gebruikt volgens de instructies in de doos.
        </p>

        <p>
          <strong>Herroepingsrecht / Retourzendingen</strong>
          <br />
          De consument klant heeft het recht om zijn bestelling te herroepen, zonder redenen te hoeven opgeven, binnen
          vijftien (15) kalenderdagen vanaf de dag waarop de klant, of een door de klant aangewezen derde die niet de
          vervoerder is, fysiek bezit neemt van het product.
        </p>

        <p>
          NOA Technologies srl
          <br />
          Rue Arsène Grosjean, 6 – 5020 Temploux
          <br />
          info@noatec.eu
        </p>
        <p>Intracommunautair BTW-nr.: BE0728 877 103 – BCE-nr.: 0728 877 103</p>
      </>
    ),
    downloadButton: "Download het herroepingsformulier",
  },
};

export default function CGV() {
  const locale = useLocale() as "fr" | "en" | "de" | "nl";
  const content = CGVContent[locale] || CGVContent.fr;

  return (
    <PageContainer className="bg-white" noPadding fullWidth>
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20 lg:py-24">
        <div className="w-24 h-1 bg-brand-orange mb-8"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#3a3a3a] mb-8 text-center">{content.title}</h1>

        <div className="prose prose-lg max-w-none text-justify leading-relaxed">{content.content}</div>

        <div className="mt-12">
          <a
            href="/assets/2020/01/formulaire-de-retractaction.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-brand-green text-white font-semibold rounded hover:bg-brand-orange transition-all duration-300"
          >
            {content.downloadButton}
          </a>
        </div>
      </div>
    </PageContainer>
  );
}
