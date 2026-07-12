# Feedback sur les erreurs de compilation du Backend (Branche main après fusion)

Lors de la validation de la fusion de la branche `feat/backend-scaffolding` dans `main`, la commande `npm run typecheck` a échoué avec 39 erreurs dans le dossier `server/`. Voici le détail des anomalies identifiées :

---

## 1. Imports relatifs incorrects dans les routes imbriquées

Dans le fichier [publish.post.ts](file:///home/norris/my-projects/portfolio/server/api/articles/[id]/publish.post.ts) (situé à 4 niveaux de profondeur : `server/api/articles/[id]/`), les chemins d'importation relatifs remontent trop peu de dossiers :

```typescript
// Actuel :
import { PublishArticleUseCase } from '../../modules/articles/application/publish-article.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

// Recommandé (remonter de 4 niveaux) :
import { PublishArticleUseCase } from '../../../../modules/articles/application/publish-article.use-case';
import { handleDomainError } from '../../../../utils/handle-errors';
import { useContainer } from '../../../../utils/use-container';
```

---

## 2. Erreurs TS1484 dues à `verbatimModuleSyntax`

Dans plusieurs fichiers de cas d'usage (use-cases) du backend, les interfaces ou types importés ne portent pas le modificateur `type`, ce qui déclenche des erreurs TypeScript car la règle `verbatimModuleSyntax` est activée dans `tsconfig.json` :

* **Fichiers concernés** :
  * `server/modules/articles/application/create-article.use-case.ts`
  * `server/modules/articles/application/delete-article.use-case.ts`
  * `server/modules/articles/application/get-article.use-case.ts`
  * `server/modules/articles/application/list-articles.use-case.ts`
  * `server/modules/articles/application/update-article.use-case.ts`
* **Exemple de correction** :
  ```typescript
  // Au lieu de :
  import { ArticleRepository } from '../domain/article.repository';
  // Écrire :
  import type { ArticleRepository } from '../domain/article.repository';
  ```

---

## 3. Absence des types générés de Prisma Client

Les imports depuis `@prisma/client` (tels que `PrismaClient` et `Article` dans le mapper et le repository) ne sont pas résolus car le client Prisma n'a pas encore été généré localement.
* **Résolution** : Il est nécessaire d'exécuter la génération locale des types :
  ```bash
  npx prisma generate
  ```

---

## 4. Erreurs de formatage (ESLint) dans le dossier `server/`

La commande `npm run lint` lève **27 erreurs et 1 avertissement** dans le code serveur. Elles sont principalement de trois types :

### A. Imports de types sans modificateur `type` (`@typescript-eslint/consistent-type-imports`)
De nombreux fichiers importent des éléments utilisés uniquement comme types sans utiliser `import type`. Cela peut être corrigé automatiquement en lançant `npx eslint . --fix`.
* **Fichiers concernés** :
  * `server/api/articles/[id].delete.ts`
  * `server/api/articles/[id].patch.ts`
  * `server/api/articles/[id]/publish.post.ts`
  * `server/api/articles/[slug].get.ts`
  * `server/api/articles/index.get.ts`
  * `server/api/articles/index.post.ts`
  * Tous les cas d'usages dans `server/modules/articles/application/`
  * Le dépôt Prisma et le mapper dans `server/modules/articles/infrastructure/`
  * `server/utils/auth.ts` et `server/utils/use-container.ts`

### B. Variables inutilisées (`@typescript-eslint/no-unused-vars`)
* `server/utils/auth.ts` (ligne 3) : L'argument `event` est déclaré mais jamais utilisé.
* `server/utils/handle-errors.ts` (ligne 2) : `H3Event` est importé mais inutilisé.

### C. Classe utilitaire statique superflue (`@typescript-eslint/no-extraneous-class`)
* `server/modules/articles/infrastructure/article.mapper.ts` (ligne 4) : La classe `ArticleMapper` ne contient que des méthodes statiques. ESLint recommande d'utiliser des fonctions exportées simples à la place ou de désactiver la règle si ce design est intentionnel.

---

## 5. Erreur de connexion / authentification PostgreSQL dans l'environnement local

Lors du branchement du blog à l'API réelle, le serveur local Nitro a retourné des erreurs 500 sur les endpoints `/api/articles`. 

### Anomalie :
* Les logs du serveur affichaient : `prisma:error SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` puis `Authentication failed against the database server, the provided database credentials for postgres are not valid`.

### Diagnostic :
1. **Absence du fichier `.env`** : Aucun fichier `.env` n'était présent initialement dans le dossier racine du projet. L'application tentait de se connecter avec une chaîne de connexion vide, provoquant l'erreur SCRAM.
2. **Authentification SCRAM PostgreSQL** : Une fois le fichier `.env` configuré à partir du fichier `.env.example` (`DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio?schema=public"`), le serveur PostgreSQL local (natif) a retourné une erreur d'authentification.
3. **Absence de mot de passe / Rôles manquants** :
   * Le rôle `postgres` sur le serveur local n'a pas de mot de passe configuré, ce qui empêche toute authentification par mot de passe TCP/IP local (qui exige la méthode `scram-sha-256` configurée par défaut dans `pg_hba.conf`).
   * Les rôles `portfolio` ou `norris` n'existent pas sur l'instance PostgreSQL locale.

### Solutions recommandées pour l'utilisateur :
* **Option 1 (Recommandée - Utiliser le conteneur Docker existant)** : Démarrer le conteneur PostgreSQL existant de la machine locale qui est mappé sur le port `5435` avec les identifiants `postgres:postgres` (ex. `docker start token-sentry-db`), y créer la base de données `portfolio`, puis mettre à jour le `.env` comme suit :
  ```env
  DATABASE_URL="postgresql://postgres:postgres@localhost:5435/portfolio?schema=public"
  ```
* **Option 2 (Configuration locale PostgreSQL)** : Définir un mot de passe pour l'utilisateur `postgres` système local en exécutant via le terminal :
  ```bash
  sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'votre_mot_de_passe';"
  ```
  Et mettre à jour le fichier `.env` avec ce mot de passe.
* **Option 3 (Création d'un rôle dédié)** : Se connecter en super-utilisateur et créer le rôle et la base de données `portfolio` spécifiquement :
  ```bash
  sudo -u postgres psql -c "CREATE USER portfolio WITH PASSWORD 'password';"
  sudo -u postgres psql -c "CREATE DATABASE portfolio OWNER portfolio;"
  ```

---

## 6. Conflit de paramètres de routage dans `server/api/articles/[slug].get.ts`

### Anomalie :
L'appel à `GET /api/articles/:slug` (ex. `GET /api/articles/mon-premier-article`) retourne une erreur de validation 400/500 indiquant que `slug` est `undefined` dans le schéma Zod :
`"message": "Invalid input: expected string, received undefined"`.

### Diagnostic :
En raison de la structure du dossier (`server/api/articles/[id]/` et `server/api/articles/[id].patch.ts` au même niveau que `[slug].get.ts`), Nitro extrait le paramètre dynamique de l'URL sous le nom de variable `id` (dans `event.context.params.id`) plutôt que `slug`. Par conséquent, le schéma Zod `paramsSchema` de `[slug].get.ts` qui valide `slug: z.string()` échoue systématiquement.

### Solution recommandée pour le développeur :
Modifier [server/api/articles/[slug].get.ts](file:///home/norris/my-projects/portfolio/server/api/articles/%5Bslug%5D.get.ts) pour s'adapter à la clé de paramètre fournie par Nitro :
```typescript
const paramsSchema = z.object({
  id: z.string(), // Nitro associe le paramètre de l'URL à 'id' à cause du dossier [id]/
});

export default defineEventHandler(async (event) => {
  try {
    const params = await getValidatedRouterParams(event, (data) => paramsSchema.parse(data));
    
    const useCase = useContainer().resolve<GetArticleUseCase>('GetArticleUseCase');
    const article = await useCase.execute({ slug: params.id }); // On passe params.id qui contient le slug réel
    // ...
```

---

## 7. Absence des endpoints API pour les Projets (`/api/projects`)

### Anomalie :
Il n'existe actuellement aucune route d'API dans `server/api/` pour gérer les projets (comme `GET /api/projects` ou les routes admin `POST`, `PATCH`, `DELETE`). 

### Impact sur le Frontend :
* La page d'accueil ([app/pages/index.vue](file:///home/norris/my-projects/portfolio/app/pages/index.vue)) et la page Projets ([app/pages/projects/index.vue](file:///home/norris/my-projects/portfolio/app/pages/projects/index.vue)) continuent d'utiliser des données statiques/mockées en attendant l'API.
* L'onglet "Projets" de la console d'administration ([app/pages/admin/index.vue](file:///home/norris/my-projects/portfolio/app/pages/admin/index.vue)) affiche également des projets simulés sans interactivité de modification/suppression réelle.

### Solution recommandée pour le développeur :
Créer les routes d'API correspondantes (ex. `server/api/projects/index.get.ts`, `server/api/projects/index.post.ts`, etc.) connectées à un cas d'usage Prisma de la même manière que pour les articles.

---

## 8. [RÉSOLU] Absence de l'endpoint pour le formulaire de contact (`POST /api/contact`)

* **Résolu par** : Création de [server/api/contact.post.ts](file:///home/norris/my-projects/portfolio/server/api/contact.post.ts) avec `nodemailer` et câblage complet du composant frontend [app/components/ContactSection.vue](file:///home/norris/my-projects/portfolio/app/components/ContactSection.vue).



