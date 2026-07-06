import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

const SECTIONS: { title: string; body: ReactNode }[] = [
  {
    title: "1. Responsable du traitement",
    body: (
      <p>
        Le responsable du traitement des données collectées sur ce site est Ilias Remchani
        (Brussels Emergency 112), joignable à l&apos;adresse{" "}
        <a className="underline-hover" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    ),
  },
  {
    title: "2. Données collectées",
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Formulaire de contact : nom, e-mail, sujet et contenu du message.</li>
        <li>
          Galeries privées : un code d&apos;accès est généré pour chaque galerie ; sa saisie est
          vérifiée côté serveur et n&apos;est jamais stockée en clair.
        </li>
        <li>
          Cookies techniques de session (accès admin, accès à une galerie privée), aucun cookie
          de mesure d&apos;audience ou publicitaire n&apos;est déposé par défaut.
        </li>
        <li>
          Le fil Instagram affiché sur le site est fourni par un service tiers d&apos;intégration
          (widget) qui peut appliquer sa propre politique de confidentialité.
        </li>
      </ul>
    ),
  },
  {
    title: "3. Finalités et base légale",
    body: (
      <p>
        Ces données sont traitées pour répondre aux demandes de contact (intérêt légitime /
        exécution de mesures précontractuelles) et pour sécuriser l&apos;accès aux galeries
        privées destinées aux équipes (intérêt légitime lié à la protection des contenus).
      </p>
    ),
  },
  {
    title: "4. Durée de conservation",
    body: (
      <p>
        Les photographies des galeries privées sont automatiquement et définitivement
        supprimées (fichiers et métadonnées) à l&apos;issue de la durée de disponibilité fixée
        lors de la création de chaque galerie, afin de limiter au strict nécessaire le stockage
        de données. Les messages de contact sont conservés le temps nécessaire au traitement de
        la demande, puis supprimés ou archivés de façon minimale.
      </p>
    ),
  },
  {
    title: "5. Destinataires et sous-traitants",
    body: (
      <p>
        Les données sont hébergées par l&apos;hébergeur de l&apos;application et par Supabase
        Inc. (base de données et stockage des fichiers), agissant en tant que sous-traitants.
        Aucune donnée n&apos;est vendue ni partagée à des fins publicitaires.
      </p>
    ),
  },
  {
    title: "6. Tes droits",
    body: (
      <p>
        Conformément au RGPD, tu disposes d&apos;un droit d&apos;accès, de rectification,
        d&apos;effacement, de limitation, d&apos;opposition et de portabilité de tes données.
        Pour exercer ces droits, écris à{" "}
        <a className="underline-hover" href={`mailto:${SITE.email}`}>{SITE.email}</a>. Tu peux
        également introduire une réclamation auprès de l&apos;Autorité de protection des données
        belge (APD, autoriteprotectiondonnees.be).
      </p>
    ),
  },
  {
    title: "7. Droits sur les images et responsabilité",
    body: (
      <>
        <p>
          Toutes les photographies présentes sur ce site sont protégées par le droit
          d&apos;auteur. Toute reproduction, diffusion ou utilisation sans autorisation écrite
          préalable est interdite.
        </p>
        <p>
          Les galeries privées sont destinées exclusivement aux personnes ayant reçu un code
          d&apos;accès. La personne qui reçoit un code est responsable de sa non-divulgation ;
          l&apos;usage que des tiers font des photographies après téléchargement (partage,
          publication, modification) relève de leur seule responsabilité et ne saurait engager
          celle de l&apos;éditeur du site.
        </p>
        <p>
          Le site est fourni « tel quel ». L&apos;éditeur ne peut être tenu responsable des
          indisponibilités temporaires, de la perte de contenus après la date d&apos;expiration
          annoncée d&apos;une galerie, ni des contenus des sites tiers vers lesquels des liens
          sont proposés. Pour toute demande de retrait d&apos;image (droit à l&apos;image),
          écris à{" "}
          <a className="underline-hover" href={`mailto:${SITE.email}`}>{SITE.email}</a> ; elle
          sera traitée dans les meilleurs délais.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="space-y-10">
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <h3 className="font-display text-xl">{section.title}</h3>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">{section.body}</div>
        </div>
      ))}
    </div>
  );
}
