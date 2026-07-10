# Module News

Ce module gère les actualités (NewsArticles) avec prise en charge du téléchargement d'image de couverture (cover image) via Vercel Blob.

---

## Types TypeScript (Pour le Frontend)

Voici les interfaces pour typer les retours de l'API côté Frontend (Next.js) :

```typescript
export type ArticleCategory = 'ACTUALITE' | 'EVENEMENT' | 'COMMUNIQUE';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  category: ArticleCategory;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    name: string;
  };
}

export interface PaginatedNews {
  data: NewsArticle[];
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

### 1. Lister les articles publiés
Retourne les articles ayant `isPublished: true`, triés par date de publication décroissante.
- **Route** : `GET /api/v1/news`
- **Authentification** : Non
- **Query Params** : 
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `category` (ArticleCategory, optionnel)
- **Retourne** : `PaginatedNews`

### 2. Récupérer un article via son slug
- **Route** : `GET /api/v1/news/:slug`
- **Authentification** : Non
- **Retourne** : `NewsArticle` (404 si introuvable ou non publié)

---

## Upload Image de Couverture (Vercel Blob)

### Générer un token d'upload (Admin/Editor)
Permet au dashboard de récupérer un token pour téléverser directement l'image de couverture vers Vercel Blob, évitant que le backend ne gère les fichiers.
- **Route** : `POST /api/v1/news/upload-url`
- **Authentification** : Oui (Admin/Editor)
- **Body** : `{ "filename": "image.jpg" }`
- **Contraintes** :
  - Extensions autorisées : `.jpg`, `.jpeg`, `.png`, `.webp`
  - Taille maximale : **5MB**
  - Path généré : `news/{timestamp}-{slugified-filename}`
- **Retourne** : `{ "type": "blob", "clientPayload": "ey..." }`

---

## Endpoints (Backoffice)

### 1. Lister tous les articles (Admin/Editor)
Inclus les brouillons.
- **Route** : `GET /api/v1/news/admin/all`
- **Authentification** : Oui

### 2. Créer un article (Admin/Editor)
- **Route** : `POST /api/v1/news`
- **Authentification** : Oui
- **Comportement** : `authorId` est injecté automatiquement depuis le token JWT de l'utilisateur connecté. L'article est créé avec `isPublished: false`.
- **Body** :
```json
{
  "title": "Nouveau partenariat...",
  "excerpt": "Nous sommes fiers...",
  "content": "<p>Contenu HTML complet...</p>",
  "coverImageUrl": "https://...blob.vercel-storage.com/...jpg",
  "category": "ACTUALITE"
}
```

### 3. Mettre à jour un article (Admin/Editor)
- **Route** : `PATCH /api/v1/news/:id`
- **Authentification** : Oui

### 4. Publier un article (Admin/Editor)
- **Route** : `PATCH /api/v1/news/:id/publish`
- **Authentification** : Oui
- **Comportement** : Passe `isPublished` à `true`. Fixe `publishedAt` à l'instant actuel si ce n'était pas déjà fait.

### 5. Supprimer un article (Admin uniquement)
- **Route** : `DELETE /api/v1/news/:id`
- **Authentification** : Oui (`ADMIN` requis)
