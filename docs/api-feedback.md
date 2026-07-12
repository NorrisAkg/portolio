# [RÉSOLU] Feedback sur les anomalies de l'API et du Backend

Toutes les anomalies identifiées lors de la phase d'intégration ont été corrigées avec succès. Le backend compile proprement, le linting est au vert et tous les modules requis sont fonctionnels.

---

## 1. [RÉSOLU] Imports relatifs incorrects dans les routes imbriquées
* **Correction** : Les chemins d'importation dans [publish.post.ts](file:///home/norris/my-projects/portfolio/server/api/articles/[id]/publish.post.ts) ont été corrigés pour remonter le bon niveau de répertoires (`../../../../`).

## 2. [RÉSOLU] Erreurs TS1484 dues à `verbatimModuleSyntax`
* **Correction** : Tous les imports de types ou d'interfaces dans les fichiers d'application et de domaine ont été convertis en `import type`.

## 3. [RÉSOLU] Absence des types générés de Prisma Client
* **Correction** : Exécution de `npx prisma generate` après les modifications du schéma de données.

## 4. [RÉSOLU] Erreurs de formatage (ESLint) dans le dossier `server/`
* **Correction** : Remplacement des imports standards de types par des `import type` et nettoyage des variables inutilisées. La commande `pnpm lint` s'exécute maintenant avec **0 erreur**.

## 5. [RÉSOLU] Connexion à la base de données PostgreSQL locale
* **Correction** : Configuration du fichier `.env` sur le port PostgreSQL local fonctionnel (`5435`) et synchronisation du schéma via `npx prisma db push`.

## 6. [RÉSOLU] Conflit de paramètres de routage dans `[slug].get.ts`
* **Correction** : Adaptation du schéma Zod dans [server/api/articles/[slug].get.ts](file:///home/norris/my-projects/portfolio/server/api/articles/%5Bslug%5D.get.ts) pour valider `params.id` à la place de `params.slug` en accord avec le comportement de routage dynamique de Nitro.

## 7. [RÉSOLU] Absence des endpoints API pour les Projets (`/api/projects`)
* **Correction** : Création complète du module `projects` (`server/modules/projects/`) avec ses cas d'usage, sa table Prisma multilingue, son dépôt d'infrastructure, sa configuration d'injection de dépendances et ses routes d'API correspondantes. Les données par défaut ont été enregistrées en base via le script [prisma/seed.ts](file:///home/norris/my-projects/portfolio/prisma/seed.ts).

## 8. [RÉSOLU] Absence de l'endpoint pour le formulaire de contact (`POST /api/contact`)
* **Correction** : Création de [server/api/contact.post.ts](file:///home/norris/my-projects/portfolio/server/api/contact.post.ts) avec `nodemailer` et câblage complet du formulaire de contact dans le frontend.
