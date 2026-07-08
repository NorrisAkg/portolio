---
name: commit
description: >
  Valide le code (lint, typecheck, tests), crée un commit sur la branche
  actuelle, et ouvre une Pull Request vers main. À déclencher dès que
  l'utilisateur dit "commit", "fais un commit", "ouvre une PR" ou toute
  formulation similaire.
---

# Skill — Commit & Pull Request

## Vue d'ensemble

Ce skill automatise le cycle complet :
1. **Pré-vol** — lint, typecheck et tests
2. **Commit** — staging de tous les changements et commit
3. **Pull Request** — création de la PR vers `main` via `gh`

Toute erreur dans les étapes 1–2 est **bloquante** : on ne commit pas si le code est cassé.

---

## Étape 1 — Vérifications pré-commit

Lance les trois commandes dans l'ordre. Arrête-toi à la première erreur.

```bash
# 1a. Lint
pnpm lint

# 1b. Vérification des types TypeScript
pnpm typecheck

# 1c. Tests Vitest (si des fichiers de test existent)
pnpm vitest run --reporter=verbose 2>/dev/null || true
```

> **Règle** : si `pnpm lint` ou `pnpm typecheck` échoue, stoppe et rapporte
> l'erreur à l'utilisateur **sans committer**. Demande-lui s'il veut corriger
> ou forcer le commit malgré tout.

> **Tests** : si Vitest n'est pas encore configuré ou que le dossier `tests/`
> est vide (seulement des `.gitkeep`), signale-le mais ne bloque pas.

---

## Étape 2 — Préparer le commit

### 2a. État du dépôt

```bash
git status
git diff --stat
```

Présente un résumé des fichiers modifiés à l'utilisateur.

### 2b. Message de commit

- Si l'utilisateur a fourni un message → utilise-le tel quel.
- Sinon → génère un message en **Conventional Commits** (`feat:`, `fix:`,
  `chore:`, `refactor:`, `docs:`, etc.) basé sur les fichiers modifiés.
- Le titre du commit doit être ≤ 72 caractères.
- Ajoute un corps si les changements sont non-triviaux (liste des fichiers
  importants et ce qui a changé).

### 2c. Staging et commit

```bash
git add -A
git commit -m "<message>"
```

---

## Étape 3 — Push de la branche

```bash
# Récupère le nom de la branche courante
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Pousse la branche (crée le remote si nécessaire)
git push -u origin "$BRANCH"
```

Si la branche est `main` ou `master` : **refuse de committer directement**,
demande à l'utilisateur de créer une branche de feature d'abord.

---

## Étape 4 — Création de la Pull Request

### 4a. Vérifier que `gh` est disponible

```bash
gh auth status
```

Si `gh` n'est pas installé ou pas authentifié, fournis les instructions :
```
# Installation
sudo apt install gh    # Debian/Ubuntu
brew install gh        # macOS

# Authentification
gh auth login
```

### 4b. Titre et description de la PR

- **Titre** : reprend le titre du commit (ou demande à l'utilisateur).
- **Description** : génère un résumé markdown structuré :
  ```markdown
  ## Contexte
  <Pourquoi ce changement ?>

  ## Changements
  - <liste des modifications clés>

  ## Tests
  - [x] `pnpm lint` ✅
  - [x] `pnpm typecheck` ✅
  - [x] Vitest ✅ (ou N/A si pas de tests)
  ```

### 4c. Créer la PR

```bash
gh pr create \
  --base main \
  --head "$BRANCH" \
  --title "<titre>" \
  --body "<description>"
```

---

## Gestion des erreurs

| Situation | Comportement |
|---|---|
| `pnpm lint` échoue | Stoppe, affiche les erreurs, demande confirmation |
| `pnpm typecheck` échoue avec erreurs dans `server/` | Signale que c'est hors-scope, demande si on continue |
| Tests échouent | Stoppe, affiche le résumé des échecs |
| Branche = `main` | Refuse, demande de créer une branche |
| `gh` non disponible | Continue sans PR, donne les instructions manuelles |
| PR déjà ouverte pour cette branche | Met à jour le titre/body avec `gh pr edit` |

---

## Comportement attendu (résumé)

```
1. pnpm lint           → OK ou BLOQUANT
2. pnpm typecheck      → OK ou BLOQUANT
3. pnpm vitest run     → OK ou AVERTISSEMENT
4. git add -A && git commit -m "..."
5. git push -u origin <branch>
6. gh pr create --base main ...
7. Affiche l'URL de la PR
```

À la fin, affiche l'URL de la PR créée pour que l'utilisateur puisse la consulter immédiatement.
