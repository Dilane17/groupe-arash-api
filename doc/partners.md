# Module Partners

Ce module gère les partenaires du GROUPE ARASH, qui seront affichés (via leurs logos) sur la vitrine. Le téléchargement des logos utilise Vercel Blob avec la même approche "client-upload" sécurisée que les autres modules.

---

## Types TypeScript (Pour le Frontend)

Voici les interfaces pour typer les retours de l'API côté Frontend (Next.js) :

```typescript
export type PartnerCategory = 'INSTITUTIONNEL' | 'TECHNIQUE' | 'COMMERCIAL';

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  category: PartnerCategory;
  isActive: boolean;
  order: number;
  createdAt: string;
}
```

---

## Endpoints (Publics)

### 1. Lister les partenaires actifs
Retourne la liste des partenaires ayant `isActive: true`.
Ils sont automatiquement triés par `order` (ascendant) puis par `createdAt` (décroissant).
- **Route** : `GET /api/v1/partners`
- **Authentification** : Non
- **Query Params** : 
  - `category` (PartnerCategory, optionnel)
- **Retourne** : `Partner[]`

---

## Upload Logo (Vercel Blob)

### Générer un token d'upload (Admin/Editor)
Permet au backoffice de récupérer un token pour téléverser directement le logo vers Vercel Blob.
- **Route** : `POST /api/v1/partners/upload-url`
- **Authentification** : Oui (Admin/Editor)
- **Body** : `{ "filename": "logo-microsoft.svg" }`
- **Contraintes** :
  - Extensions autorisées : `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg` (type MIME `image/svg+xml`)
  - Taille maximale : **2MB**
  - Path généré : `partners/{timestamp}-{slugified-filename}`
- **Retourne** : `{ "type": "blob", "clientPayload": "ey..." }`

---

## Endpoints (Backoffice)

### 1. Lister tous les partenaires (Admin/Editor)
Inclus les partenaires inactifs (pour la gestion dans le dashboard).
- **Route** : `GET /api/v1/partners/admin/all`
- **Authentification** : Oui

### 2. Ajouter un partenaire (Admin/Editor)
- **Route** : `POST /api/v1/partners`
- **Authentification** : Oui
- **Body** :
```json
{
  "name": "Microsoft",
  "logoUrl": "https://...blob.vercel-storage.com/...svg",
  "websiteUrl": "https://microsoft.com",
  "category": "TECHNIQUE",
  "order": 10 // Optionnel, par défaut 0
}
```

### 3. Mettre à jour un partenaire (Admin/Editor)
- **Route** : `PATCH /api/v1/partners/:id`
- **Authentification** : Oui
- **Note** : Utile pour modifier l'`order`, le `websiteUrl`, ou passer `isActive` à `false` (pour le cacher de la vitrine).

### 4. Supprimer un partenaire (Admin uniquement)
- **Route** : `DELETE /api/v1/partners/:id`
- **Authentification** : Oui (`ADMIN` requis)
