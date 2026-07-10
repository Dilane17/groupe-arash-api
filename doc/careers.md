# Module Careers

Ce module gère les offres d'emploi (Job Offers), la réception des candidatures (Job Applications) avec leurs CVs, ainsi que l'intégration avec Vercel Blob pour le stockage des fichiers.

---

## Types TypeScript (Pour le Frontend)

Voici les interfaces pour typer les retours de l'API côté Frontend (Next.js) :

```typescript
export type JobType = 'CDI' | 'CDD' | 'STAGE' | 'FREELANCE';
export type JobApplicationStatus = 'RECEIVED' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';

export interface JobOffer {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    applications: number;
  };
}

export interface JobApplication {
  id: string;
  jobOfferId: string | null; // null pour candidature spontanée
  fullName: string;
  email: string;
  phone: string;
  message: string;
  cvUrl: string;
  status: JobApplicationStatus;
  createdAt: string;
  jobOffer?: { title: string }; // Inclus dans les listings admin
}

export interface PaginatedApplications {
  data: JobApplication[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BlobTokenResponse {
  type: 'blob';
  clientPayload: string;
}
```

---

## Endpoints : Offres d'emploi (Job Offers)

### 1. Lister les offres actives (Public)
Retourne toutes les offres d'emploi où `isActive` est `true`, triées de la plus récente à la plus ancienne.
- **Route** : `GET /api/v1/careers`
- **Authentification** : Non

### 2. Récupérer une offre via son slug (Public)
- **Route** : `GET /api/v1/careers/:slug`
- **Authentification** : Non
- **Retourne** : Objet `JobOffer` (404 si inactive ou introuvable).

### 3. Lister toutes les offres (Admin/Editor)
Retourne toutes les offres (actives et inactives) avec le compteur de candidatures.
- **Route** : `GET /api/v1/careers/admin/all`
- **Authentification** : Oui (Token requis)

### 4. Créer, Mettre à jour, Supprimer une offre (Admin/Editor)
- **POST** `/api/v1/careers` : Crée une offre (le slug est généré automatiquement).
- **PATCH** `/api/v1/careers/:id` : Met à jour une offre (permet d'archiver via `isActive: false`).
- **DELETE** `/api/v1/careers/:id` : Supprime une offre (réservé aux rôles `ADMIN`).

---

## Upload de CV (Vercel Blob)

Pour éviter que les gros fichiers (CVs) transitent par ce backend, nous utilisons la méthode *Client Upload* de Vercel Blob. 
Le frontend demande d'abord une autorisation à ce endpoint, puis upload le fichier directement vers les serveurs de Vercel.

### Générer un token d'upload (Public)
> ⚠️ Protégé par Rate Limit : 3 requêtes / 10 minutes par IP.

- **Route** : `POST /api/v1/careers/upload-url`
- **Body** : `{ "filename": "mon_cv.pdf" }`
- **Retourne** :
```json
{
  "type": "blob",
  "clientPayload": "ey..." 
}
```
*Le frontend devra utiliser la fonction `upload` du SDK `@vercel/blob/client` en lui passant ce `clientPayload`.*
Le CV sera restreint aux formats `.pdf`, `.doc`, `.docx` et à une taille maximale de **5MB**.

---

## Endpoints : Candidatures (Job Applications)

### 1. Soumettre une candidature (Public)
> ⚠️ Protégé par Rate Limit : 5 requêtes / 10 minutes par IP.

- **Route** : `POST /api/v1/careers/apply`
- **Authentification** : Non
- **Body** : 
```json
{
  "jobOfferId": "cuid123", // Optionnel, supprimez la clé pour une candidature spontanée
  "fullName": "Marie Dupont",
  "email": "marie.dupont@example.com",
  "phone": "+33 6 12 34 56 78",
  "message": "Bonjour, voici ma candidature...",
  "cvUrl": "https://<id>.public.blob.vercel-storage.com/cv/12345-mon_cv.pdf" // L'URL retournée par Vercel Blob après l'upload
}
```
- **Comportement** :
  - Sauvegarde la candidature avec `status: RECEIVED`.
  - Envoie un accusé de réception à `email`.
  - Envoie une notification RH à l'administrateur.

### 2. Lister les candidatures (Admin/Editor)
- **Route** : `GET /api/v1/careers/applications/list`
- **Authentification** : Oui
- **Query Params** : `page`, `limit`, `jobOfferId`, `status`.

### 3. Changer le statut d'une candidature (Admin/Editor)
- **Route** : `PATCH /api/v1/careers/applications/:id/status`
- **Authentification** : Oui
- **Body** : `{ "status": "REVIEWED" }` (statuts possibles: `RECEIVED`, `REVIEWED`, `ACCEPTED`, `REJECTED`)
