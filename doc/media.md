# Module Media

Ce module gère la médiathèque (photos, vidéos, documents) du GROUPE ARASH. 
L'upload s'effectue via Vercel Blob avec une approche "client-upload" sécurisée, et la particularité est que le point de terminaison de suppression de média nettoie également le fichier correspondant sur Vercel Blob.

---

## Types TypeScript (Pour le Frontend)

Voici les interfaces pour typer les retours de l'API côté Frontend (Next.js) :

```typescript
export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT';

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: MediaType;
  category: string; // Ex: 'installations', 'produits', 'evenements'
  createdAt: string;
}

export interface PaginatedMedia {
  data: MediaItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

---

## Endpoints (Publics)

### 1. Lister les médias
Retourne la liste paginée des médias pour l'affichage vitrine ou galerie.
- **Route** : `GET /api/v1/media`
- **Authentification** : Non
- **Query Params** : 
  - `page` (number, default: 1)
  - `limit` (number, default: 20)
  - `type` (MediaType, optionnel)
  - `category` (string, optionnel)
- **Retourne** : `PaginatedMedia`

---

## Upload de Média (Vercel Blob)

### Générer un token d'upload (Admin/Editor)
Permet au backoffice de récupérer un token pour téléverser directement le fichier vers Vercel Blob. Les limites et types acceptés dépendent du type de média demandé.
- **Route** : `POST /api/v1/media/upload-url`
- **Authentification** : Oui (Admin/Editor)
- **Query Params obligatoires** : 
  - `type` (MediaType : `IMAGE`, `VIDEO`, `DOCUMENT`)
  - `category` (string, ex: `installations`)
- **Body** : `{ "filename": "photo-1.jpg" }`
- **Contraintes dynamiques selon le `type`** :
  - **IMAGE** : `.jpg`, `.jpeg`, `.png`, `.webp` (Max 10MB)
  - **VIDEO** : `.mp4`, `.mov` (`video/quicktime`) (Max 100MB)
  - **DOCUMENT** : `.pdf` (Max 10MB)
  - Path généré : `media/{category}/{timestamp}-{slugified-filename}`
- **Retourne** : `{ "type": "blob", "clientPayload": "ey..." }`

---

## Endpoints (Backoffice)

### 1. Ajouter une référence de média (Admin/Editor)
Une fois le fichier téléversé avec succès via le token généré, ce endpoint enregistre la référence en base de données.
- **Route** : `POST /api/v1/media`
- **Authentification** : Oui
- **Body** :
```json
{
  "title": "Photo de l'installation X",
  "type": "IMAGE",
  "category": "installations",
  "url": "https://...blob.vercel-storage.com/...jpg"
}
```

### 2. Supprimer un média (Admin/Editor)
Supprime l'entrée en base de données **ET** appelle automatiquement l'API Vercel Blob (`del()`) pour supprimer physiquement le fichier associé afin de libérer de l'espace.
- **Route** : `DELETE /api/v1/media/:id`
- **Authentification** : Oui (Admin/Editor)
