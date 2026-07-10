# 🏛️ GROUPE ARASH - API Backend

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

Ceci est l'API Backend officielle pour les plateformes web du **GROUPE ARASH** (Vitrine publique et Backoffice d'administration).
Le projet est architecturé autour de **NestJS**, **Prisma ORM** (avec base de données Neon PostgreSQL), et gère l'upload sécurisé de fichiers via **Vercel Blob** (Client-Upload).

---

## 🎯 Fonctionnalités Principales

- **🔑 Authentification** : Système JWT complet avec protection de routes, stratégies Passport, décorateurs personnalisés, et gestion de rôles (`ADMIN`, `EDITOR`).
- **📇 Module Contact** : Traitement des formulaires de contact vitrine, avec accusé de réception automatisé et notifications par email (via le SDK **Resend**).
- **💼 Module Carrières** : Gestion des offres d'emploi, des statuts, génération automatique de slugs uniques et gestion des candidatures spontanées ou ciblées.
- **📰 Module Actualités** : Gestion des publications (Actualités, Événements, Communiqués) avec un système brouillon/publié.
- **🤝 Module Partenaires** : Gestion des logos partenaires affichés sur la vitrine, avec gestion de l'ordre d'affichage.
- **📂 Module Médiathèque** : Hub centralisé pour toutes les photos, vidéos et documents de l'entreprise.
- **☁️ Storage Vercel Blob** : Génération de tokens d'upload éphémères pour permettre aux frontends de téléverser des fichiers (CV, Images, Vidéos) de manière ultra-sécurisée et performante.
- **🛡️ Sécurité & Stabilité** : Configuration Helmet, Throttler (Rate Limiting), Validation DTO stricte (class-validator), et configuration CORS multi-domaines.

---

## 📚 Documentation Détaillée

Chaque module technique possède sa propre documentation exhaustive :

- [Documentation Globale & Standards](./doc/README.md)
- [Module Auth](./doc/auth.md)
- [Module Contact](./doc/contact.md)
- [Module Carrières](./doc/careers.md)
- [Module Actualités](./doc/news.md)
- [Module Partenaires](./doc/partners.md)
- [Module Media](./doc/media.md)

_(La documentation interactive des endpoints **Swagger** est disponible sur la route `/api/docs` au lancement de l'API)._

---

## 🚀 Installation & Lancement (Développement)

### 1. Prérequis

- **Node.js** (v18+ recommandé)
- **npm** ou **yarn**
- Une base de données **PostgreSQL** (Neon.tech recommandé)

### 2. Configuration Environnement

Copiez le fichier d'exemple et remplissez vos informations :

```bash
cp .env.example .env
```

Vérifiez que toutes les clés sont configurées (Notamment `DATABASE_URL`, `JWT_SECRET`, `RESEND_API_KEY`, et `BLOB_READ_WRITE_TOKEN`).

### 3. Installation des dépendances

```bash
npm install
```

### 4. Base de données & Prisma

Générez le client Prisma, synchronisez votre schéma, et exécutez le seed pour créer l'utilisateur Admin par défaut :

```bash
npx prisma generate
npx prisma db push
npm run build
npx prisma db seed
```

### 5. Démarrage de l'application

Le projet se lance avec NestJS. Ne pas utiliser `npm run dev` (qui n'existe pas par défaut sous NestJS).

```bash
# Mode développement avec auto-reload
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API tournera sur l'URL de base : `http://localhost:3000/api/v1`

---

## 🏗️ Déploiement

Cette API est prête à être déployée sur n'importe quelle plateforme Node.js standard (Render, Railway, VPS, Vercel etc.).

**Points de vérification pré-déploiement :**

- Variables d'environnement de production injectées (`DATABASE_URL`, `FRONTEND_URL`, etc.).
- Les commandes de build sont : `npx prisma generate && npm run build`
- La commande de démarrage est : `npm run start:prod`

---

_Propulsé par le GROUPE ARASH._
