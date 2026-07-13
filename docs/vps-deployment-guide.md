# Guide de Déploiement Complet sur VPS — Portfolio Norris Akogbede

Ce guide est conçu pour vous accompagner pas à pas dans le déploiement de votre application portfolio (Nuxt 4, Prisma, PostgreSQL) sur un serveur privé virtuel (VPS) sous Ubuntu. Toutes les étapes sont détaillées et expliquées de manière à être accessibles, même pour un débutant.

---

## Sommaire
1. [Prérequis](#1-prérequis)
2. [Étape 1 : Connexion SSH et mise à jour du serveur](#étape-1--connexion-ssh-et-mise-à-jour-du-serveur)
3. [Étape 2 : Installation de Node.js et PNPM](#étape-2--installation-de-nodejs-et-pnpm)
4. [Étape 3 : Installation et configuration de PostgreSQL](#étape-3--installation-et-configuration-de-postgresql)
5. [Étape 4 : Déploiement du code et configuration de l'environnement](#étape-4--déploiement-du-code-et-configuration-de-lenvironnement)
6. [Étape 5 : Compilation de l'application Nuxt](#étape-5--compilation-de-lapplication-nuxt)
7. [Étape 6 : Gestion du processus en arrière-plan avec PM2](#étape-6--gestion-du-processus-en-arrière-plan-avec-pm2)
8. [Étape 7 : Configuration d'Nginx en Reverse Proxy et SSL (HTTPS)](#étape-7--configuration-dnginx-en-reverse-proxy-et-ssl-https)
9. [Étape 8 : Sécurisation du serveur avec le pare-feu (UFW)](#étape-8--sécurisation-du-serveur-avec-le-pare-feu-ufw)

---

## 1. Prérequis

Avant de commencer, assurez-vous de disposer de :
* Un **VPS** fraîchement installé sous **Ubuntu** (version 22.04 LTS ou 24.04 LTS recommandée).
* Un **nom de domaine** configuré pour pointer vers l'adresse IP publique de votre VPS :
  * Un enregistrement de type **A** pointant `votredomaine.com` vers `IP_DU_VPS`.
  * Un enregistrement de type **A** pointant `www.votredomaine.com` vers `IP_DU_VPS`.
* Les accès de connexion de votre VPS (l'adresse IP et le mot de passe root ou votre clé SSH).

---

## Étape 1 : Connexion SSH et mise à jour du serveur

Le SSH (Secure Shell) est le protocole standard qui vous permet de prendre le contrôle à distance de votre serveur en toute sécurité via une console textuelle.

1. Ouvrez un terminal sur votre machine locale et connectez-vous au VPS :
   ```bash
   ssh root@IP_DU_VPS
   ```
   *(Remplacez `IP_DU_VPS` par l'adresse IP de votre serveur).*

2. Mettez à jour la liste des paquets logiciels du système pour garantir que vous installez des versions récentes et sécurisées :
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. Installez quelques outils système de base nécessaires :
   ```bash
   sudo apt install -y curl git ufw
   ```

---

## Étape 2 : Installation de Node.js et PNPM

Nuxt étant un framework basé sur JavaScript, le serveur requiert l'environnement d'exécution **Node.js** en production. Le projet utilise **PNPM** comme gestionnaire de dépendances pour plus de rapidité et d'économie d'espace disque.

1. **Installer NVM (Node Version Manager)** :
   NVM permet d'installer et de changer de version de Node.js très facilement. C'est la méthode la plus propre.
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```

2. Rechargez la configuration de votre terminal pour activer `nvm` :
   ```bash
   source ~/.bashrc
   ```

3. Installez la version LTS (Long Term Support) de Node.js (version 20 recommandée) :
   ```bash
   nvm install 20
   nvm use 20
   ```

4. Activez **Corepack** pour installer automatiquement **PNPM** :
   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

---

## Étape 3 : Installation et configuration de PostgreSQL

Le portfolio utilise PostgreSQL pour persister les articles de blog, les projets et les utilisateurs d'administration.

1. Installez le serveur PostgreSQL sur le VPS :
   ```bash
   sudo apt install -y postgresql postgresql-contrib
   ```

2. Connectez-vous à la console d'administration PostgreSQL en tant qu'utilisateur système `postgres` :
   ```bash
   sudo -i -u postgres psql
   ```

3. Créez un utilisateur de base de données dédié au projet (remplacez `mot_de_passe_securise` par un vrai mot de passe robuste) :
   ```sql
   CREATE USER portfolio WITH PASSWORD 'mot_de_passe_securise';
   ```

4. Créez la base de données de production et affectez-en la propriété à l'utilisateur créé :
   ```sql
   CREATE DATABASE portfolio_prod OWNER portfolio;
   ```

5. Quittez la console PostgreSQL :
   ```sql
   \q
   exit
   ```

---

## Étape 4 : Déploiement du code et configuration de l'environnement

1. Placez-vous dans le répertoire utilisateur et clonez votre dépôt Git :
   ```bash
   cd /var/www
   # S'assurer d'avoir les droits d'écriture sur /var/www si nécessaire, ou clonez dans /home
   # Pour ce guide, nous utiliserons /var/www/portfolio
   sudo git clone https://github.com/NorrisAkg/portolio.git portfolio
   sudo chown -R $USER:$USER /var/www/portfolio
   cd /var/www/portfolio
   ```

2. Créez le fichier de configuration de l'environnement de production `.env` :
   ```bash
   cp .env.example .env
   nano .env
   ```

3. Remplissez le fichier `.env` avec les valeurs de production réelles :
   ```env
   # Chaîne de connexion à la base de données PostgreSQL créée à l'étape 3
   DATABASE_URL="postgresql://portfolio:mot_de_passe_securise@localhost:5432/portfolio_prod?schema=public"

   # Une clé secrète complexe générée aléatoirement pour signer vos jetons JWT d'authentification
   # Astuce de génération : openssl rand -base64 32
   JWT_SECRET="remplacez_par_une_cle_secrete_tres_longue"

   # Configuration SMTP pour le formulaire de contact (ex: Mailgun, SendGrid ou Gmail)
   SMTP_HOST="smtp.mailtrap.io"
   SMTP_PORT=2525
   SMTP_USER="votre_utilisateur"
   SMTP_PASS="votre_mot_de_passe"
   SMTP_FROM="noreply@votredomaine.com"
   SMTP_TO="norris@votredomaine.com"

   # Identifiants de l'administrateur initial lors du seeding (Créé en base de données)
   # Après l'exécution du script de seeding à l'étape 5, vous pourrez supprimer ces deux lignes de votre .env
   ADMIN_EMAIL="admin@votredomaine.com"
   ADMIN_PASSWORD="mot_de_passe_admin_tres_securise"
   ```
   *(Pour enregistrer et quitter `nano`, appuyez sur `Ctrl+O`, `Entrée`, puis `Ctrl+X`).*

4. Installez les packages requis par l'application :
   ```bash
   pnpm install
   ```

5. Synchronisez la structure de votre base de données et peuplez-la avec les données par défaut (compte admin, articles de démo, projets initiaux) :
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

---

## Étape 5 : Compilation de l'application Nuxt

En développement, Nuxt compile le code à la volée. En production, pour des raisons de performances, il faut pré-compiler (build) tout le code pour obtenir un serveur Node hautement optimisé (situé dans le dossier `.output/`).

1. Lancez la compilation de production :
   ```bash
   pnpm build
   ```
   Cette commande génère un répertoire de production autonome sous `.output/server/index.mjs` prêt à servir le site public et les API.

---

## Étape 6 : Gestion du processus en arrière-plan avec PM2

Si vous lancez l'application directement dans votre console avec `node`, le processus s'arrêtera dès que vous fermerez votre terminal. **PM2** est un gestionnaire de processus qui s'assure que votre serveur Node tourne en continu en arrière-plan et redémarre automatiquement en cas de crash du serveur.

1. Installez PM2 globalement sur le système :
   ```bash
   npm install -g pm2
   ```

2. Démarrez l'application compilée avec PM2 :
   ```bash
   pm2 start .output/server/index.mjs --name "portfolio"
   ```

3. Configurez PM2 pour qu'il se relance automatiquement au démarrage physique du VPS (en cas de reboot matériel) :
   ```bash
   pm2 startup
   ```
   *Cette commande affiche une ligne de commande à copier-coller dans votre terminal (ex: `sudo env PATH=... pm2 startup systemd -u root ...`). Exécutez cette ligne.*

4. Sauvegardez la liste des processus actifs de PM2 pour finaliser la configuration :
   ```bash
   pm2 save
   ```

---

## Étape 7 : Configuration d'Nginx en Reverse Proxy et SSL (HTTPS)

Par défaut, l'application Nuxt écoute en interne sur le port `3000`. Pour que les visiteurs puissent accéder à votre site sur les ports standards du Web (HTTP 80 et HTTPS 443), nous allons utiliser **Nginx** comme "Reverse Proxy" (un serveur web frontal qui intercepte les requêtes des visiteurs et les transmet à notre serveur Nuxt local).

1. Installez Nginx sur le VPS :
   ```bash
   sudo apt install -y nginx
   ```

2. Créez un fichier de configuration d'hôte virtuel Nginx pour votre site :
   ```bash
   sudo nano /etc/nginx/sites-available/portfolio
   ```

3. Ajoutez-y la configuration suivante (remplacez `votredomaine.com` par votre vrai nom de domaine) :
   ```nginx
   server {
       listen 80;
       server_name votredomaine.com www.votredomaine.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded-for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. Activez la configuration en créant un lien symbolique vers le dossier `sites-enabled` :
   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   ```

5. Supprimez la configuration par défaut d'Nginx pour éviter les conflits :
   ```bash
   sudo rm /etc/nginx/sites-enabled/default
   ```

6. Testez que la configuration d'Nginx ne contient pas d'erreurs de syntaxe :
   ```bash
   sudo nginx -t
   ```

7. Rechargez Nginx pour appliquer les modifications :
   ```bash
   sudo systemctl reload nginx
   ```

### Sécurisation SSL (HTTPS) avec Let's Encrypt (Certbot)
Le protocole HTTPS est indispensable pour chiffrer les communications, protéger le cookie de connexion du back-office et améliorer votre référencement Google (SEO). Nous allons installer des certificats SSL gratuits et automatisés grâce à Let's Encrypt.

1. Installez Certbot et son plugin pour Nginx :
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Générez les certificats SSL pour votre domaine. Certbot va automatiquement modifier votre fichier de configuration Nginx pour y ajouter le protocole sécurisé :
   ```bash
   sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com
   ```
   *Répondez aux questions (adresse email, acceptation des conditions). Choisissez l'option de redirection automatique de HTTP vers HTTPS si Certbot vous la propose.*

---

## Étape 8 : Sécurisation du serveur avec le pare-feu (UFW)

Il est crucial de bloquer tous les ports réseau du serveur qui ne doivent pas être exposés publiquement (comme la base de données PostgreSQL ou le port 3000 de Nuxt). Seuls les ports HTTP, HTTPS et SSH doivent être ouverts.

1. Autorisez les connexions SSH pour ne pas perdre la main sur votre serveur :
   ```bash
   sudo ufw allow OpenSSH
   ```

2. Autorisez les connexions HTTP et HTTPS gérées par Nginx :
   ```bash
   sudo ufw allow 'Nginx Full'
   ```

3. Activez le pare-feu :
   ```bash
   sudo ufw enable
   ```
   *(Validez par `y` s'il demande confirmation).*

4. Vérifiez le statut du pare-feu :
   ```bash
   sudo ufw status
   ```

---

## 🎉 Félicitations !
Votre portfolio Norris Akogbede est maintenant déployé avec succès sur votre VPS, sécurisé par SSL (HTTPS), et configuré pour démarrer automatiquement en arrière-plan.

### Commandes utiles pour la maintenance :
* **Voir les logs de l'application Nuxt** : `pm2 logs portfolio`
* **Redémarrer l'application (après une mise à jour de code)** : `pm2 restart portfolio`
* **Vérifier l'état de santé globale** : `pm2 status`
* **Vérifier les logs d'accès web Nginx** : `sudo tail -f /var/log/nginx/access.log`
