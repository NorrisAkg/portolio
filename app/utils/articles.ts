// Frontend fake data — replace with useFetch('/api/articles/:slug') in Phase 3.
// Slugs are URL-stable and language-neutral; titles/dates/excerpt/body translate
// via the two ARTICLE_BODIES_{FR,EN} maps, indexed by article position.

export type Locale = 'fr' | 'en'

export type ArticleTone = 'warm' | 'cool' | 'navy'

export type ArticleBlock =
  | { type: 'lede', text: string }
  | { type: 'h2', id: string, text: string }
  | { type: 'p', text: string }
  | { type: 'pull', text: string }
  | { type: 'ul', items: string[] }
  | { type: 'ol', items: string[] }

export type ArticleBody = {
  cover: string
  toc: { id: string, label: string }[]
  blocks: ArticleBlock[]
}

export type ArticleMeta = {
  slug: string
  tag: { fr: string, en: string }
  tone: ArticleTone
  date: { fr: string, en: string }
  read: string
  title: { fr: string, en: string }
  excerpt: { fr: string, en: string }
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'mvp-blockchain',
    tag: { fr: 'STRATÉGIE', en: 'STRATEGY' },
    tone: 'warm',
    date: { fr: '12 avril 2026', en: 'April 12, 2026' },
    read: '6 min',
    title: {
      fr: "Pourquoi votre MVP n'a pas besoin de blockchain",
      en: "Why your MVP doesn't need blockchain",
    },
    excerpt: {
      fr: "La majorité des projets Web3 que je refuse pourraient être résolus avec une base de données et un PDF.",
      en: "Most Web3 projects I turn down could ship with a database and a PDF.",
    },
  },
  {
    slug: 'nuxt-nestjs-combo',
    tag: { fr: 'TECH', en: 'TECH' },
    tone: 'cool',
    date: { fr: '28 mars 2026', en: 'March 28, 2026' },
    read: '9 min',
    title: {
      fr: 'Nuxt 3 + NestJS: le combo que je recommande aux PME',
      en: 'Nuxt 3 + NestJS: the combo I recommend to SMEs',
    },
    excerpt: {
      fr: "Un seul langage, un seul écosystème, une vélocité que peu de stacks offrent à ce niveau de maturité.",
      en: 'One language, one ecosystem, a velocity few stacks match at this level of maturity.',
    },
  },
  {
    slug: 'client-brief-3-questions',
    tag: { fr: 'FREELANCE', en: 'FREELANCE' },
    tone: 'warm',
    date: { fr: '5 mars 2026', en: 'March 5, 2026' },
    read: '4 min',
    title: {
      fr: "Le brief idéal d'un client (et comment l'obtenir)",
      en: 'The ideal client brief (and how to get it)',
    },
    excerpt: {
      fr: "Trois questions que je pose avant chaque devis pour éliminer 80% des malentendus en amont.",
      en: 'Three questions I ask before every quote to clear up 80% of misunderstandings.',
    },
  },
  {
    slug: 'react-native-production',
    tag: { fr: 'TECH', en: 'TECH' },
    tone: 'cool',
    date: { fr: '18 février 2026', en: 'February 18, 2026' },
    read: '11 min',
    title: {
      fr: 'React Native en production : ce qui casse vraiment',
      en: 'React Native in production: what actually breaks',
    },
    excerpt: {
      fr: "Trois ans d'apps mobiles livrées, et la liste des pièges que je vois encore tomber sur des équipes seniors.",
      en: 'Three years of shipped mobile apps and the list of traps I still see senior teams fall into.',
    },
  },
  {
    slug: 'estimate-3-scenarios',
    tag: { fr: 'STRATÉGIE', en: 'STRATEGY' },
    tone: 'navy',
    date: { fr: '2 février 2026', en: 'February 2, 2026' },
    read: '7 min',
    title: {
      fr: 'Estimer un projet : la méthode des 3 scénarios',
      en: 'Estimating a project: the 3-scenario method',
    },
    excerpt: {
      fr: "Pourquoi je refuse les devis « au feeling » et comment je présente un chiffrage qui survit au scope creep.",
      en: 'Why I refuse "gut-feel" quotes and how I present a number that survives scope creep.',
    },
  },
  {
    slug: 'invoice-cfa-euros-stablecoin',
    tag: { fr: 'FREELANCE', en: 'FREELANCE' },
    tone: 'navy',
    date: { fr: '14 janvier 2026', en: 'January 14, 2026' },
    read: '5 min',
    title: {
      fr: 'Facturer en CFA, en euros, ou en stablecoin ?',
      en: 'Invoicing in CFA, euros, or stablecoin?',
    },
    excerpt: {
      fr: "Mon arbitrage actuel pour vivre à Cotonou et facturer trois zones monétaires sans perdre 8% à chaque transfert.",
      en: 'My current arbitrage to live in Cotonou and invoice three currency zones without losing 8% per transfer.',
    },
  },
]

export const ARTICLE_BODIES_FR: ArticleBody[] = [
  {
    cover: 'MVP_BLOCKCHAIN_COVER.JPG',
    toc: [
      { id: 'context',  label: 'Le contexte' },
      { id: 'symptome', label: 'Le symptôme' },
      { id: 'test',     label: 'Le test des 3 questions' },
      { id: 'vrai-cas', label: 'Quand la blockchain est utile' },
      { id: 'conclu',   label: "Ce qu'il faut retenir" },
    ],
    blocks: [
      { type: 'lede', text: "On me contacte chaque semaine pour « ajouter du Web3 » à un produit qui n'existe pas encore. Voici la conversation que j'ai à chaque fois — et pourquoi je refuse 8 missions sur 10." },
      { type: 'h2', id: 'context', text: 'Le contexte' },
      { type: 'p', text: "Depuis 2023, deux tiers des nouveaux briefs que je reçois mentionnent « blockchain », « tokenisation » ou « NFT » dans les trois premières lignes. La moitié de ces porteurs de projet n'ont pas encore validé qu'un seul client paierait pour la version simple de leur produit. Le reste a généralement un Excel à 300 lignes et l'intuition — pas la donnée — qu'il faudrait le décentraliser." },
      { type: 'p', text: "Mon métier, ce n'est pas de leur dire oui. C'est de leur économiser six mois de développement et 40 000 € de smart contracts pour découvrir qu'ils avaient besoin d'un formulaire et d'une base PostgreSQL." },
      { type: 'h2', id: 'symptome', text: 'Le symptôme' },
      { type: 'p', text: "Le pattern est toujours le même. Le fondateur a lu trois threads, regardé deux conférences, et a conclu que la confiance est un problème technique. Elle ne l'est presque jamais. La confiance entre acheteur et vendeur sur un marketplace agricole au Bénin se construit avec une politique de retour claire, un médiateur humain, et un délai de paiement raisonnable. Pas avec un escrow on-chain qui coûte 2 € de gas par transaction sur un panier moyen de 12 €." },
      { type: 'pull', text: "La décentralisation est une réponse technique à un problème d'incitations. Si vos incitations sont claires et alignées, vous n'avez besoin de rien décentraliser." },
      { type: 'h2', id: 'test', text: 'Le test des 3 questions' },
      { type: 'p', text: "Avant chaque devis, je pose trois questions. Si la réponse à l'une d'elles est « non », la blockchain est probablement la mauvaise réponse :" },
      { type: 'ol', items: [
        "Existe-t-il plusieurs parties qui ne se font pas confiance et qui doivent écrire dans le même registre ?",
        "Le coût d'une fraude ou d'une erreur de saisie est-il supérieur au coût opérationnel d'une chaîne (gas, audit, complexité) ?",
        "Le produit a-t-il déjà des utilisateurs qui paient pour la version centralisée ?",
      ] },
      { type: 'p', text: "La troisième est la plus impopulaire. Et c'est la plus importante. Sans utilisateurs payants, vous ne construisez pas un produit ; vous construisez une démo pour lever des fonds. Ce n'est pas la même mission, et ça ne devrait pas être facturé pareil." },
      { type: 'h2', id: 'vrai-cas', text: 'Quand la blockchain est utile' },
      { type: 'p', text: "Pour être clair : je livre des smart contracts en production. La tokenisation immobilière dont je parle dans le projet « Plateforme RWA » en est un bon exemple. Plusieurs investisseurs, plusieurs juridictions, un actif sous-jacent dont la propriété fractionnée doit être lisible par tous — et un montant moyen par opération qui rend le coût de la chaîne négligeable." },
      { type: 'p', text: 'Trois cas que je vois revenir régulièrement et qui justifient la chaîne :' },
      { type: 'ul', items: [
        "Coordination multi-acteurs sans tiers de confiance préexistant (registres, certifications croisées).",
        "Programmabilité financière qu'aucun rail bancaire ne supporte aujourd'hui (paiements conditionnels, escrow automatisé multi-monnaies).",
        "Provenance vérifiable sur un actif de forte valeur (œuvres, immobilier, supply chain critique).",
      ] },
      { type: 'p', text: "En dehors de ces cas, je propose presque toujours un MVP Web2 d'abord — quitte à migrer plus tard si le produit prouve son adoption. C'est moins sexy, beaucoup moins cher, et le produit existe vraiment à la fin du sprint." },
      { type: 'h2', id: 'conclu', text: "Ce qu'il faut retenir" },
      { type: 'p', text: "Choisir une stack, ce n'est pas choisir une religion. C'est choisir la voie la plus courte entre un problème métier et un livrable qui rapporte. Si la voie la plus courte passe par une base PostgreSQL et un formulaire Stripe, c'est ce que je vous recommanderai — même si ça raccourcit ma facture." },
      { type: 'p', text: "Et si la voie la plus courte passe par Solidity, je l'écrirai aussi. Mais pas par défaut. Jamais par défaut." },
    ],
  },
  {
    cover: 'NUXT_NESTJS_STACK.JPG',
    toc: [
      { id: 'pourquoi', label: 'Pourquoi ce duo' },
      { id: 'dx',       label: "L'expérience développeur" },
      { id: 'prod',     label: 'Ce qui change en prod' },
      { id: 'limites',  label: 'Les limites' },
    ],
    blocks: [
      { type: 'lede', text: "Quatre ans que je livre des produits avec ce duo. Voici pourquoi c'est devenu mon choix par défaut pour 80% des missions PME — et les cas où je m'en éloigne." },
      { type: 'h2', id: 'pourquoi', text: 'Pourquoi ce duo' },
      { type: 'p', text: "Un seul langage côté serveur et côté front : TypeScript. Un seul écosystème de packages : npm. Un seul mental model pour la gestion d'état, l'injection de dépendances et le routing. Cette unité réduit drastiquement le coût cognitif des passages de contexte." },
      { type: 'p', text: "Nuxt 3 gère le SSR, le SEO, l'hydratation et le code-splitting sans config. NestJS apporte une architecture modulaire claire, l'injection de dépendances, la validation, et un écosystème mûr pour la persistance et l'auth." },
      { type: 'h2', id: 'dx', text: "L'expérience développeur" },
      { type: 'p', text: "Le hot reload côté Nuxt est instantané. Côté NestJS, le watcher TypeScript est moins rapide qu'un Vite mais largement acceptable. Le typage partagé entre front et back via un package commun élimine 90% des bugs d'API qu'on voyait il y a cinq ans." },
      { type: 'pull', text: "Le bon outil n'est pas celui qui fait le plus. C'est celui qui vous fait perdre le moins de temps à comprendre pourquoi il ne marche pas." },
      { type: 'h2', id: 'prod', text: 'Ce qui change en prod' },
      { type: 'ul', items: [
        "Le SSR Nuxt rend les pages d'atterrissage indexables sans hack.",
        "NestJS scale verticalement très bien jusqu'à 5–10 K req/min ; au-delà, on découpe en modules indépendants.",
        "L'observabilité (OpenTelemetry, pino) est triviale à brancher dans les deux.",
      ] },
      { type: 'h2', id: 'limites', text: 'Les limites' },
      { type: 'p', text: "Pour un produit purement temps-réel (chat, jeu, collaboratif), je passe à un autre setup : Elysia ou Fastify côté serveur, Solid ou Svelte côté client. Nuxt + NestJS reste optimisé pour la production CRUD de qualité, pas pour la latence < 50 ms perçue." },
    ],
  },
  {
    cover: 'BRIEF_IDEAL_DESK.JPG',
    toc: [
      { id: 'avant', label: 'Avant le devis' },
      { id: 'q1',    label: "Question 1 — l'utilisateur" },
      { id: 'q2',    label: 'Question 2 — la mesure' },
      { id: 'q3',    label: 'Question 3 — le délai' },
    ],
    blocks: [
      { type: 'lede', text: "Trois questions que je pose avant chaque devis pour éliminer 80% des malentendus en amont. Aucune n'est technique." },
      { type: 'h2', id: 'avant', text: 'Avant le devis' },
      { type: 'p', text: "Un devis chiffré sans brief solide est une fiction. Il sert à rassurer tout le monde et engage personne. Je préfère consacrer 90 minutes à un cadrage gratuit que livrer un PDF à trois pages que personne ne relira." },
      { type: 'h2', id: 'q1', text: "Question 1 — Qui est l'utilisateur, vraiment ?" },
      { type: 'p', text: "Pas la cible marketing. L'utilisateur réel qui ouvrira l'app dans trois mois, depuis quel appareil, dans quelle situation. Si le client répond « tout le monde », on a un problème de cadrage avant d'avoir un problème technique." },
      { type: 'h2', id: 'q2', text: 'Question 2 — Comment mesurera-t-on que ça marche ?' },
      { type: 'p', text: "Un chiffre. Un seul. « Augmenter le panier moyen de 18 % » est mieux que « améliorer l'expérience ». Le premier dirige les arbitrages techniques ; le second les empêche." },
      { type: 'pull', text: "Si on ne peut pas écrire la métrique sur un Post-it, on ne sait pas ce qu'on construit." },
      { type: 'h2', id: 'q3', text: 'Question 3 — Quel est le délai non négociable ?' },
      { type: 'p', text: "Pas le délai souhaité. Le délai après lequel le projet perd son sens : foire commerciale, levée de fonds, contrainte réglementaire. Cette date détermine le scope. Sans elle, on planifie en arbitraire." },
    ],
  },
  {
    cover: 'RN_PRODUCTION_PHONE.JPG',
    toc: [
      { id: 'navigation', label: 'La navigation' },
      { id: 'build',      label: 'Le build natif' },
      { id: 'perfs',      label: 'Les perfs perçues' },
    ],
    blocks: [
      { type: 'lede', text: "Trois ans d'apps mobiles livrées, et la liste des pièges que je vois encore tomber sur des équipes seniors. Rien d'exotique — juste des choses qu'on oublie sous pression." },
      { type: 'h2', id: 'navigation', text: 'La navigation' },
      { type: 'p', text: "React Navigation a mûri, mais la gestion des deep links + auth + restauration d'état reste piégeuse. Sur trois apps sur quatre, je vois encore des écrans qui se ré-empilent à chaque retour en background. La solution est moins dans la lib que dans le découpage clair : un stack par contexte d'utilisation, jamais un mégastack global." },
      { type: 'h2', id: 'build', text: 'Le build natif' },
      { type: 'p', text: "EAS Build a résolu 80% des problèmes. Les 20% restants, c'est la signature iOS, les profils ad-hoc, et les versions de Node qui dérivent entre la CI et la machine du dev. Je verrouille tout dans un `.tool-versions` dès le jour 1." },
      { type: 'pull', text: 'Une équipe qui passe deux heures par semaine à debugger sa CI perd un trimestre par an.' },
      { type: 'h2', id: 'perfs', text: 'Les perfs perçues' },
      { type: 'p', text: "La perf objective est rarement le problème. La perf perçue, oui. Trois leviers que j'applique systématiquement : skeleton screens au lieu de spinners, prefetch des écrans suivants probables, et désactivation des animations sur les Android bas de gamme." },
    ],
  },
  {
    cover: 'ESTIMATE_SCENARIOS.JPG',
    toc: [
      { id: 'feeling', label: 'Pourquoi pas au feeling' },
      { id: 'trois',   label: 'Les trois scénarios' },
      { id: 'vendre',  label: 'Comment je le présente' },
    ],
    blocks: [
      { type: 'lede', text: "Le devis « au feeling » est un mensonge poli. Voici la méthode que j'utilise pour produire un chiffrage qui survit au scope creep — et qui force le client à arbitrer en connaissance de cause." },
      { type: 'h2', id: 'feeling', text: 'Pourquoi pas au feeling' },
      { type: 'p', text: "Un devis au feeling protège le développeur, pas le client. Il intègre une marge cachée pour absorber les imprévus, ce qui rend le projet 30 à 50 % plus cher sans qu'on sache pourquoi. Et quand l'imprévu arrive quand même, on facture en plus." },
      { type: 'h2', id: 'trois', text: 'Les trois scénarios' },
      { type: 'ul', items: [
        "Scénario A — strict minimum, ce qui doit marcher absolument. Chiffré au plus bas réaliste.",
        "Scénario B — version cible, ce qu'on voudrait vraiment livrer. Médian.",
        "Scénario C — version idéale, le périmètre élargi qui ferait gagner du temps après. Haut.",
      ] },
      { type: 'h2', id: 'vendre', text: 'Comment je le présente' },
      { type: 'p', text: "Je présente toujours les trois ensemble, jamais séparément. Le client n'arbitre pas sur le prix, il arbitre sur le périmètre. Et il découvre que la version cible (B) est presque toujours la plus rentable pour lui — pas la moins chère, pas la plus complète." },
      { type: 'pull', text: "Un chiffrage qui ne laisse pas le client choisir n'est pas un devis. C'est une facture déguisée." },
    ],
  },
  {
    cover: 'INVOICE_CURRENCY_MIX.JPG',
    toc: [
      { id: 'contexte', label: 'Mon contexte' },
      { id: 'cfa',      label: 'Le CFA' },
      { id: 'euros',    label: 'Les euros' },
      { id: 'stable',   label: 'Les stablecoins' },
      { id: 'choix',    label: 'Mon arbitrage actuel' },
    ],
    blocks: [
      { type: 'lede', text: 'Vivre à Cotonou, facturer trois zones monétaires, et perdre moins de 2 % en frais. Mon arbitrage actuel, ce qui marche, ce qui frotte.' },
      { type: 'h2', id: 'contexte', text: 'Mon contexte' },
      { type: 'p', text: "Je facture des clients au Bénin, en France et occasionnellement aux États-Unis. Mes dépenses sont majoritairement en CFA, secondairement en euros. Je n'ai pas de structure off-shore — juste un statut local et un compte en euros." },
      { type: 'h2', id: 'cfa', text: 'Le CFA' },
      { type: 'p', text: "Avec les clients locaux, je facture en CFA, point. Mobile money pour les petites factures, virement pour les plus grosses. C'est lent mais ça marche, et c'est cohérent fiscalement." },
      { type: 'h2', id: 'euros', text: 'Les euros' },
      { type: 'p', text: "Pour la France, j'ai un IBAN euro. SEPA gratuit, conversion EUR→XOF via Wise à 0,4 % typique. C'est de loin la voie la plus propre." },
      { type: 'h2', id: 'stable', text: 'Les stablecoins' },
      { type: 'p', text: 'Pour les clients US ou les missions Web3, USDC sur Polygon ou Base. Frais < 0,10 $, instantané. Conversion en CFA via une rampe locale ou un OTC de confiance, autour de 0,8–1,2 %.' },
      { type: 'pull', text: "Le bon rail de paiement, c'est celui qui s'efface. Si je passe une demi-journée par mois à arbitrer, j'ai déjà perdu." },
      { type: 'h2', id: 'choix', text: 'Mon arbitrage actuel' },
      { type: 'p', text: "Par défaut, IBAN euro pour tout ce qui sort de la zone CFA. Stablecoin uniquement quand le client n'a pas de rail bancaire pratique ou quand la mission est on-chain de toute façon. Et toujours, toujours, un buffer de trésorerie en euros pour absorber les variations." },
    ],
  },
]

export const ARTICLE_BODIES_EN: ArticleBody[] = [
  {
    cover: 'MVP_BLOCKCHAIN_COVER.JPG',
    toc: [
      { id: 'context',  label: 'The context' },
      { id: 'symptom',  label: 'The symptom' },
      { id: 'test',     label: 'The 3-question test' },
      { id: 'real',     label: 'When blockchain helps' },
      { id: 'takeaway', label: 'What to take away' },
    ],
    blocks: [
      { type: 'lede', text: "I get pinged every week to \"add Web3\" to a product that doesn't exist yet. Here's the conversation I have every single time — and why I turn down 8 out of 10 of those briefs." },
      { type: 'h2', id: 'context', text: 'The context' },
      { type: 'p', text: "Since 2023, two thirds of incoming briefs mention \"blockchain\", \"tokenisation\" or \"NFT\" in the first three lines. Half of those founders haven't validated that a single customer would pay for the plain version of their product. The rest typically have a 300-row spreadsheet and a hunch — not data — that it ought to be decentralised." },
      { type: 'p', text: "My job is not to say yes. It's to save them six months of development and €40K of smart contracts only to discover they needed a form and a PostgreSQL." },
      { type: 'h2', id: 'symptom', text: 'The symptom' },
      { type: 'p', text: 'The pattern is always the same. The founder read three threads, watched two talks, and concluded that trust is a technical problem. It almost never is. Trust between buyer and seller on an agricultural marketplace in Benin is built with a clear returns policy, a human mediator, and a reasonable payment delay. Not with an on-chain escrow that costs €2 of gas per transaction on a €12 basket.' },
      { type: 'pull', text: "Decentralisation is a technical answer to an incentives problem. If your incentives are clear and aligned, you don't need to decentralise anything." },
      { type: 'h2', id: 'test', text: 'The 3-question test' },
      { type: 'p', text: 'Before every quote I ask three questions. If the answer to any of them is "no", blockchain is probably the wrong answer:' },
      { type: 'ol', items: [
        "Are there multiple parties that don't trust each other and must write to the same registry?",
        "Is the cost of fraud or input error higher than the operational cost of a chain (gas, audit, complexity)?",
        "Does the product already have paying users on a centralised version?",
      ] },
      { type: 'p', text: "The third is the most unpopular. And the most important. Without paying users, you're not building a product; you're building a demo to raise funds. That's not the same mission, and it shouldn't be priced the same." },
      { type: 'h2', id: 'real', text: 'When blockchain actually helps' },
      { type: 'p', text: 'To be clear: I ship Solidity to production. The real-estate tokenisation case I discuss under the RWA project is a good example. Multiple investors, multiple jurisdictions, a fractional ownership that must be legible to all parties — and an average ticket size that makes the chain cost negligible.' },
      { type: 'p', text: 'Three cases that recur and justify a chain:' },
      { type: 'ul', items: [
        'Multi-party coordination with no pre-existing trusted third party (registries, cross-certifications).',
        'Financial programmability no banking rail supports today (conditional payments, multi-currency escrow).',
        'Verifiable provenance on high-value assets (artworks, real estate, critical supply chain).',
      ] },
      { type: 'p', text: 'Outside those cases, I almost always propose a Web2 MVP first — happy to migrate later if the product proves adoption. Less sexy, much cheaper, and the product actually exists at the end of the sprint.' },
      { type: 'h2', id: 'takeaway', text: 'What to take away' },
      { type: 'p', text: "Picking a stack isn't picking a religion. It's picking the shortest path between a business problem and a deliverable that pays. If the shortest path runs through PostgreSQL and a Stripe form, that's what I'll recommend — even if it shortens my invoice." },
      { type: 'p', text: "And if the shortest path runs through Solidity, I'll write it too. But not by default. Never by default." },
    ],
  },
  {
    cover: 'NUXT_NESTJS_STACK.JPG',
    toc: [
      { id: 'why',   label: 'Why this duo' },
      { id: 'dx',    label: 'Developer experience' },
      { id: 'prod',  label: 'What changes in prod' },
      { id: 'limit', label: 'The limits' },
    ],
    blocks: [
      { type: 'lede', text: 'Four years of shipping with this duo. Why it became my default for 80% of SME work — and the cases where I step away from it.' },
      { type: 'h2', id: 'why', text: 'Why this duo' },
      { type: 'p', text: 'One language server-side and client-side: TypeScript. One package ecosystem: npm. One mental model for state, dependency injection and routing. That unity slashes the cognitive cost of context-switching.' },
      { type: 'p', text: 'Nuxt 3 handles SSR, SEO, hydration and code-splitting out of the box. NestJS brings a clear modular architecture, DI, validation, and a mature ecosystem for persistence and auth.' },
      { type: 'h2', id: 'dx', text: 'Developer experience' },
      { type: 'p', text: "Hot reload on Nuxt is instant. NestJS's TypeScript watcher isn't as quick as Vite but more than acceptable. Shared typing between front and back via a common package eliminates 90% of the API bugs we used to see five years ago." },
      { type: 'pull', text: "The right tool isn't the one that does the most. It's the one that wastes the least of your time when something goes wrong." },
      { type: 'h2', id: 'prod', text: 'What changes in prod' },
      { type: 'ul', items: [
        'Nuxt SSR makes landing pages indexable without hacks.',
        'NestJS scales vertically very well up to 5–10K req/min; beyond that, split into independent modules.',
        'Observability (OpenTelemetry, pino) is trivial to wire in on both sides.',
      ] },
      { type: 'h2', id: 'limit', text: 'The limits' },
      { type: 'p', text: 'For a purely real-time product (chat, game, collaboration), I switch setups: Elysia or Fastify server-side, Solid or Svelte client-side. Nuxt + NestJS remains optimised for quality CRUD in production, not sub-50ms perceived latency.' },
    ],
  },
  {
    cover: 'BRIEF_IDEAL_DESK.JPG',
    toc: [
      { id: 'before', label: 'Before the quote' },
      { id: 'q1', label: 'Question 1 — the user' },
      { id: 'q2', label: 'Question 2 — the metric' },
      { id: 'q3', label: 'Question 3 — the deadline' },
    ],
    blocks: [
      { type: 'lede', text: 'Three questions I ask before every quote that clear up 80% of misunderstandings up front. None of them are technical.' },
      { type: 'h2', id: 'before', text: 'Before the quote' },
      { type: 'p', text: "A numbered quote without a real brief is fiction. It reassures everyone and commits no-one. I'd rather spend 90 minutes on a free scoping call than ship a three-page PDF no-one will reread." },
      { type: 'h2', id: 'q1', text: 'Question 1 — Who is the user, really?' },
      { type: 'p', text: "Not the marketing persona. The actual user who'll open the app in three months, on which device, in what situation. If the client answers \"everyone\", we have a scoping problem before we have a technical one." },
      { type: 'h2', id: 'q2', text: 'Question 2 — How will we measure success?' },
      { type: 'p', text: 'One number. Just one. "Lift average cart by 18%" beats "improve the experience". The first drives technical trade-offs; the second blocks them.' },
      { type: 'pull', text: "If we can't write the metric on a Post-it, we don't know what we're building." },
      { type: 'h2', id: 'q3', text: "Question 3 — What's the non-negotiable deadline?" },
      { type: 'p', text: 'Not the wished date. The date after which the project loses its meaning: trade show, fundraise, regulatory cutoff. That date dictates scope. Without it, you plan in the abstract.' },
    ],
  },
  {
    cover: 'RN_PRODUCTION_PHONE.JPG',
    toc: [
      { id: 'nav',   label: 'Navigation' },
      { id: 'build', label: 'Native build' },
      { id: 'perf',  label: 'Perceived perf' },
    ],
    blocks: [
      { type: 'lede', text: "Three years of shipped mobile apps and the list of traps I still see senior teams fall into. Nothing exotic — just the things you forget under pressure." },
      { type: 'h2', id: 'nav', text: 'Navigation' },
      { type: 'p', text: "React Navigation has matured, but deep-links + auth + state restoration remains tricky. On three apps out of four I still see screens re-stacking on every background-return. The fix is less about the lib than about clean partitioning: one stack per usage context, never a global megastack." },
      { type: 'h2', id: 'build', text: 'Native build' },
      { type: 'p', text: "EAS Build solved 80% of it. The remaining 20%: iOS signing, ad-hoc profiles, and Node versions drifting between CI and the dev's machine. I lock everything in a `.tool-versions` from day 1." },
      { type: 'pull', text: 'A team spending two hours a week debugging its CI loses a full quarter every year.' },
      { type: 'h2', id: 'perf', text: 'Perceived performance' },
      { type: 'p', text: 'Objective perf is rarely the issue. Perceived perf is. Three levers I systematically apply: skeleton screens instead of spinners, prefetch the likely next screens, and disable animations on low-end Android.' },
    ],
  },
  {
    cover: 'ESTIMATE_SCENARIOS.JPG',
    toc: [
      { id: 'why',   label: 'Why not gut-feel' },
      { id: 'three', label: 'The three scenarios' },
      { id: 'pitch', label: 'How I pitch it' },
    ],
    blocks: [
      { type: 'lede', text: 'A "gut-feel" quote is a polite lie. Here\'s the method I use to produce a number that survives scope creep — and forces the client to make trade-offs in the open.' },
      { type: 'h2', id: 'why', text: 'Why not gut-feel' },
      { type: 'p', text: 'A gut-feel quote protects the developer, not the client. It bakes a hidden margin to absorb the unknown, making the project 30–50% more expensive without anyone knowing why. And when the unknown shows up anyway, you bill on top.' },
      { type: 'h2', id: 'three', text: 'The three scenarios' },
      { type: 'ul', items: [
        'Scenario A — strict minimum, the things that absolutely must work. Realistic floor.',
        "Scenario B — target version, what we'd actually like to ship. Median.",
        'Scenario C — ideal version, the broader scope that saves time later. High.',
      ] },
      { type: 'h2', id: 'pitch', text: 'How I pitch it' },
      { type: 'p', text: "I always present all three together, never separately. The client doesn't arbitrate on price, they arbitrate on scope. And they almost always discover that the target version (B) is the best deal for them — not the cheapest, not the most complete." },
      { type: 'pull', text: "A quote that doesn't let the client choose isn't a quote. It's an invoice in disguise." },
    ],
  },
  {
    cover: 'INVOICE_CURRENCY_MIX.JPG',
    toc: [
      { id: 'context', label: 'My context' },
      { id: 'cfa',     label: 'CFA' },
      { id: 'eur',     label: 'Euros' },
      { id: 'stable',  label: 'Stablecoins' },
      { id: 'choice',  label: 'My current call' },
    ],
    blocks: [
      { type: 'lede', text: 'Living in Cotonou, invoicing three currency zones, and losing under 2% in fees. My current arbitrage, what works, what still chafes.' },
      { type: 'h2', id: 'context', text: 'My context' },
      { type: 'p', text: 'I invoice clients in Benin, France, and occasionally the US. My costs are mostly in CFA, secondarily in euros. No off-shore vehicle — just a local status and a euro account.' },
      { type: 'h2', id: 'cfa', text: 'CFA' },
      { type: 'p', text: "With local clients I invoice in CFA, full stop. Mobile money for small bills, bank transfer for the rest. Slow but it works, and it's clean for tax." },
      { type: 'h2', id: 'eur', text: 'Euros' },
      { type: 'p', text: 'For France, I have a euro IBAN. SEPA is free, EUR→XOF conversion via Wise typically 0.4%. By far the cleanest rail.' },
      { type: 'h2', id: 'stable', text: 'Stablecoins' },
      { type: 'p', text: 'For US clients or Web3 missions, USDC on Polygon or Base. Sub-$0.10 fees, instant. Conversion to CFA via a local on/off-ramp or a trusted OTC, around 0.8–1.2%.' },
      { type: 'pull', text: "The right payment rail is the one that disappears. If I spend half a day a month arbitraging, I've already lost." },
      { type: 'h2', id: 'choice', text: 'My current call' },
      { type: 'p', text: 'Default to euro IBAN for anything outside the CFA zone. Stablecoins only when the client has no practical banking rail or the mission is on-chain anyway. And always, always, a euro cash buffer to absorb swings.' },
    ],
  },
]

/** Pick localised meta + body for an article by slug. Returns null if not found. */
export function resolveArticle(slug: string, locale: Locale) {
  const idx = ARTICLES.findIndex(a => a.slug === slug)
  if (idx === -1) return null
  const meta = ARTICLES[idx]!
  const body = locale === 'fr' ? ARTICLE_BODIES_FR[idx]! : ARTICLE_BODIES_EN[idx]!
  return {
    idx,
    slug: meta.slug,
    tag: meta.tag[locale],
    tone: meta.tone,
    date: meta.date[locale],
    read: meta.read,
    title: meta.title[locale],
    excerpt: meta.excerpt[locale],
    cover: body.cover,
    toc: body.toc,
    blocks: body.blocks,
  }
}

/** Locale-aware list of blog posts (meta only) for listings + home. */
export function listArticles(locale: Locale) {
  return ARTICLES.map((a, i) => ({
    idx: i,
    slug: a.slug,
    tag: a.tag[locale],
    tone: a.tone,
    date: a.date[locale],
    read: a.read,
    title: a.title[locale],
    excerpt: a.excerpt[locale],
  }))
}
