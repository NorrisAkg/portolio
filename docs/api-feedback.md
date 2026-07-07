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

